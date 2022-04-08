import { Prisma, Consultant } from '@prisma/client';

import { IConsultantRepository } from './interfaces';

export type PrismaConsultantRepository = Prisma.ConsultantDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export class ConsultantRepository implements IConsultantRepository {
  constructor(private readonly prismaRepository: PrismaConsultantRepository) {}

  public async findAll(): Promise<Consultant[]> {
    const result = await this.prismaRepository.findMany();

    return result;
  }

  public async findById(id: number): Promise<Consultant | null> {
    const result = await this.prismaRepository.findFirst({
      where: { id },
    });

    return result;
  }

  public async create(
    consultant: Prisma.ConsultantCreateInput,
  ): Promise<Consultant> {
    const result = await this.prismaRepository.create({
      data: consultant,
    });

    return result;
  }

  public async update(
    id: number,
    consultant: Prisma.ConsultantUpdateInput,
  ): Promise<void> {
    await this.prismaRepository.update({
      where: { id },
      data: consultant,
    });
  }

  public async delete(id: number): Promise<void> {
    await this.prismaRepository.delete({ where: { id } });
  }
}
