import { Prisma, Affiliation } from '@prisma/client';

import { IAffiliationRepository } from './interfaces';

export type PrismaAffiliationRepository = Prisma.AffiliationDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export class AffiliationRepository implements IAffiliationRepository {
  constructor(private readonly prismaRepository: PrismaAffiliationRepository) { }

  public async findByName(name: string): Promise<Affiliation | null> {
    const result = await this.prismaRepository.findFirst({
      where: {
        name,
      },
    });
    return result;
  }

  public async findAll(): Promise<Affiliation[]> {
    const result = await this.prismaRepository.findMany();
    return result;
  }

  public async findById(id: number): Promise<Affiliation | null> {
    const result = await this.prismaRepository.findFirst({
      where: { id },
    });

    return result;
  }

  public async create(
    payload: Prisma.AffiliationCreateInput,
  ): Promise<Affiliation> {
    const result = await this.prismaRepository.create({
      data: payload,
    });

    return result;
  }

  public async updateById(
    id: number,
    payload: Prisma.AffiliationUpdateInput,
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
