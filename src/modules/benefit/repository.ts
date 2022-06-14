import { Prisma, Benefit } from '@prisma/client';

import { IBenefitRepository } from './interfaces';

export type PrismaBenefitRepository = Prisma.BenefitDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export class BenefitRepository implements IBenefitRepository {
  constructor(private readonly prismaRepository: PrismaBenefitRepository) {}

  public async findAll(): Promise<Benefit[]> {
    const result = await this.prismaRepository.findMany();
    return result;
  }

  public async findById(id: number): Promise<Benefit | null> {
    const result = await this.prismaRepository.findFirst({
      where: { id },
    });

    return result;
  }

  public async create(payload: Prisma.BenefitCreateInput): Promise<Benefit> {
    const result = await this.prismaRepository.create({
      data: payload,
    });

    return result;
  }

  public async updateById(
    id: number,
    payload: Prisma.BenefitUpdateInput,
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
