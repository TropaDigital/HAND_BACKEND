import { User, Prisma } from '@prisma/client';

import { authConfig } from '../../config/auth';
import { IAuthService } from '../../shared/auth/interfaces';
import { NotFoundError } from '../../shared/errors';
import { IUserRepository, IUserService } from './interfaces';

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService,
  ) {}

  public async getAll(): Promise<User[]> {
    const result = await this.userRepository.findAll();

    return result;
  }

  public async getById(id: number): Promise<User | null> {
    const result = await this.userRepository.findById(id);
    if (!result) {
      throw new NotFoundError('user not found with provided id');
    }

    return result;
  }

  public async getByEmail(email: string): Promise<User | null> {
    const result = await this.userRepository.findByEmail(email);
    if (!result) {
      throw new NotFoundError('user not found with provided email');
    }

    return result;
  }

  public async create(
    payload: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'>> {
    const hashedPassword = await this.authService.hashPassword(
      payload.password,
      authConfig().JWT_SALT,
    );
    const user = { ...payload, ...{ password: hashedPassword } };
    const result = await this.userRepository.create(user);

    return result;
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
}
