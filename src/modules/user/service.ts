/* eslint-disable @typescript-eslint/no-unused-vars */
import { User, Prisma } from '@prisma/client';
import { IMailerService } from 'src/shared/mailer/interfaces';

import { authConfig } from '../../config/auth';
import ErrorCodes from '../../enums/ErrorCodes';
import { IAuthenticationService } from '../../shared/auth/interfaces';
import { ConflictError, NotFoundError } from '../../shared/errors';
import {
  IUserRepository,
  IUserService,
  IResponseUser,
  IUser,
} from './interfaces';

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthenticationService,
    private readonly mailerService: IMailerService,
  ) {}

  public async getAll(): Promise<IResponseUser[]> {
    const users = await await this.userRepository.findAll();
    const result = users.map((user: IUser) =>
      this.removePasswordFromUser(user),
    );

    return result;
  }

  private removePasswordFromUser(user: IUser): IResponseUser {
    const { password: _password, ...result } = user;

    return result;
  }

  public async getByUserName(userName: string): Promise<IResponseUser | null> {
    const user = await this.userRepository.findByUserName(userName);
    if (!user) {
      throw new NotFoundError('user not found with provided userName');
    }

    const result = this.removePasswordFromUser(user);
    return result;
  }

  private async validateUserBeforeCreate(
    payload: Prisma.UserCreateInput,
  ): Promise<void> {
    if (payload.userName) {
      const usernameAlreadyInUse = await this.userRepository.findByUserName(
        payload.userName,
      );
      if (usernameAlreadyInUse) {
        throw new ConflictError('username already in use');
      }
    }

    if (payload.email) {
      const emailAlreadyInUse = await this.userRepository.findByEmail(
        payload.email,
      );

      if (emailAlreadyInUse) {
        throw new ConflictError('email already in use');
      }
    }
  }

  private async validateUserBeforeUpdate(
    payload: {
      id: number;
    } & Partial<Omit<User, 'id'>>,
  ): Promise<void> {
    if (payload.userName) {
      const usernameAlreadyInUse = await this.userRepository.findByUserName(
        payload.userName,
      );
      if (usernameAlreadyInUse && usernameAlreadyInUse.id !== payload.id) {
        throw new ConflictError('username already in use');
      }
    }

    if (payload.email) {
      const emailAlreadyInUse = await this.userRepository.findByEmail(
        payload.email,
      );

      if (emailAlreadyInUse && emailAlreadyInUse.id !== payload.id) {
        throw new ConflictError('email already in use');
      }
    }
  }

  public async create(payload: Prisma.UserCreateInput): Promise<IResponseUser> {
    await this.validateUserBeforeCreate(payload);

    const hashedPassword = await this.authService.hashPassword(
      payload.password,
      authConfig().JWT_SALT,
    );
    const user = { ...payload, ...{ password: hashedPassword } };
    const result = await this.userRepository.create(user);

    return this.removePasswordFromUser(result);
  }

  public async updateById(
    id: number,
    payload: Partial<Omit<User, 'id'>>,
  ): Promise<void> {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      throw new NotFoundError('user not found with provided id');
    }
    await this.validateUserBeforeUpdate({ id, ...payload });

    const result = await this.userRepository.updateById(id, payload);

    return result;
  }

  public async deleteById(id: number): Promise<void> {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      throw new NotFoundError('user not found with provided id');
    }
    const result = await this.userRepository.deleteById(id);

    return result;
  }

  public async generateAndSendLinkOfResetPassword(
    email: string,
  ): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError(
        'user not found with the provided email',
        ErrorCodes.FORGOT_PASSWORD_001,
      );
    }

    const token = await this.authService.generateToken({
      role: user.role?.name as string,
      sub: user.id,
    });
    await this.mailerService.sendResetPasswordEmail(user, token);
    return user;
  }
}
