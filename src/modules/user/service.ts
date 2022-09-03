import { User, Prisma } from '@prisma/client';
import { IMailerService } from 'src/shared/mailer/interfaces';

import { authConfig } from '../../config/auth';
import ErrorCodes from '../../enums/ErrorCodes';
import { IAuthenticationService } from '../../shared/auth/interfaces';
import { NotFoundError } from '../../shared/errors';
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

  public async create(payload: Prisma.UserCreateInput): Promise<IResponseUser> {
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
