import { Prisma, Affiliation, Address } from '@prisma/client';

import { IAffiliationRepository } from './interfaces';

export type PrismaAffiliationRepository = Prisma.AffiliationDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export class AffiliationRepository implements IAffiliationRepository {
  constructor(private readonly prismaRepository: PrismaAffiliationRepository) {}

  public async findByName(name: string): Promise<Affiliation | null> {
    const result = await this.prismaRepository.findFirst({
      where: {
        name,
      },
      include: {
        address: true,
      },
    });
    return result;
  }

  public async findAll(): Promise<Affiliation[]> {
    const result = await this.prismaRepository.findMany({
      include: {
        address: true,
      },
    });
    return result;
  }

  public async findById(id: number): Promise<Affiliation | null> {
    const result = await this.prismaRepository.findFirst({
      where: { id },
      include: {
        address: true,
      },
    });

    return result;
  }

  public async create(
    payload: Prisma.AffiliationCreateInput,
  ): Promise<Affiliation> {
    const result = await this.prismaRepository.create({
      data: {
        ...payload,
      },
    });

    return result;
  }

  public async updateById(
    id: number,
    payload: Prisma.AffiliationUpdateInput & {
      address?: Address;
    },
  ): Promise<void> {
    await this.prismaRepository.update({
      where: { id },
      data: {
        ...payload,
        ...(payload.address ? { address: { update: payload.address } } : {}),
      },
    });
  }

  public async deleteById(id: number): Promise<void> {
    await this.prismaRepository.delete({ where: { id } });
  }
}
