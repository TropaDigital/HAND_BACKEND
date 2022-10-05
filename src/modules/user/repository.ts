import { Prisma } from '@prisma/client';

import { IUserRepository, IUser } from './interfaces';

export type PrismaUserRepository = Prisma.UserDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export class UserRepository implements IUserRepository {
  constructor(private readonly prismaRepository: PrismaUserRepository) { }

  public async findAll(): Promise<IUser[]> {
    const result = await this.prismaRepository.findMany({
      include: {
        role: true,
      },
    });

    return result;
  }

  public async findById(id: number): Promise<IUser | null> {
    const result = await this.prismaRepository.findFirst({
      where: { id },
      include: {
        role: true,
      },
    });

    return result;
  }

  public async findByUserName(userName: string): Promise<IUser | null> {
    const result = await this.prismaRepository.findFirst({
      where: { userName },
      include: {
        role: true,
      },
    });

    return result;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const result = await this.prismaRepository.findFirst({
      where: { email },
      include: {
        role: true,
      },
    });

    return result;
  }

  public async create(payload: Prisma.UserCreateInput): Promise<IUser> {
    const user = await this.prismaRepository.create({
      data: {
        ...payload,
        role: {
          connect: {
            name: 'operational',
          },
        },
      },
      include: {
        role: true,
      },
    });

    return user;
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
