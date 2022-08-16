import { Prisma, User } from '@prisma/client';

import { IUserRepository, IResponseUser } from './interfaces';

export type PrismaUserRepository = Prisma.UserDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export class UserRepository implements IUserRepository {
  constructor(private readonly prismaRepository: PrismaUserRepository) {}

  public async findAll(): Promise<User[]> {
    const result = await this.prismaRepository.findMany();
    return result;
  }

  public async findById(id: number): Promise<User | null> {
    const result = await this.prismaRepository.findFirst({
      where: { id },
    });

    return result;
  }

  public async findByUserName(userName: string): Promise<User | null> {
    const result = await this.prismaRepository.findFirst({
      where: { userName },
    });

    return result;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const result = await this.prismaRepository.findFirst({
      where: { email },
    });

    return result;
  }

  public async create(payload: Prisma.UserCreateInput): Promise<IResponseUser> {
    const user = await this.prismaRepository.create({
      data: payload,
    });

    const { password: _password, ...result } = user;

    return result;
  }

  public async updateById(
    id: number,
    payload: Prisma.UserUpdateInput,
  ): Promise<void> {
    await this.prismaRepository.update({
      where: { id },
      data: payload,
    });
  }

  public async deleteById(id: number): Promise<void> {
    await this.prismaRepository.delete({ where: { id } });
  }
}
