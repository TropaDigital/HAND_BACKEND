import { User, Prisma } from '@prisma/client';

import { authConfig } from '../../config/auth';
import { IAuthenticationService } from '../../shared/auth/interfaces';
import { NotFoundError } from '../../shared/errors';
import { IUserRepository, IUserService, ResponseUser } from './interfaces';

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthenticationService,
  ) {}

  public async getAll(): Promise<ResponseUser[]> {
    const users = await await this.userRepository.findAll();
    const result = users.map((user: User) => this.removePasswordFromUser(user));

    return result;
  }

  private removePasswordFromUser(user: User): ResponseUser {
    const { password: _password, ...result } = user;

    return result;
  }

  public async getByEmail(email: string): Promise<ResponseUser | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('user not found with provided email');
    }
    const result = this.removePasswordFromUser(user);

    return result;
  }

  public async create(payload: Prisma.UserCreateInput): Promise<ResponseUser> {
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
