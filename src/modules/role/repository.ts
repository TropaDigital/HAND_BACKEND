import { Prisma, Role } from '@prisma/client';

import { IRoleRepository } from './interfaces';

export type PrismaRoleRepository = Prisma.RoleDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export class RoleRepository implements IRoleRepository {
  constructor(private readonly prismaRepository: PrismaRoleRepository) {}

  public async findAll(): Promise<Role[]> {
    const result = await this.prismaRepository.findMany();
    return result;
  }

  public async findById(id: number): Promise<Role | null> {
    const result = await this.prismaRepository.findFirst({
      where: { id },
    });

    return result;
  }

  public async create(payload: Prisma.RoleCreateInput): Promise<Role> {
    const result = await this.prismaRepository.create({
      data: payload,
    });

    return result;
  }

  public async updateById(
    id: number,
    payload: Prisma.RoleUpdateInput,
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
