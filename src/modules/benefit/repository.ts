import {
  Prisma,
  Benefit,
  PrismaClient,
  BenefitAdjustmentType,
} from '@prisma/client';
import { JsonObject } from 'swagger-ui-express';

import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import {
  getFindManyParams,
  parsePaginatedResult,
} from '../../shared/pagination/service';
import { IBenefitRepository } from './interfaces';

export type PrismaBenefitRepository = Prisma.BenefitDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export type PrismaBenefitHistoryRepository = Prisma.BenefitHistoryDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;
export class BenefitRepository implements IBenefitRepository {
  private readonly prismaBenefitRepository: PrismaBenefitRepository;

  private readonly prismaBenefitHistoryRepository: PrismaBenefitHistoryRepository;

  constructor(prismaClient: PrismaClient) {
    this.prismaBenefitRepository = prismaClient.benefit;
    this.prismaBenefitHistoryRepository = prismaClient.benefitHistory;
  }

  public async findAll(
    payload?: IFindAllParams & Prisma.BenefitWhereInput,
  ): Promise<IPaginatedAResult<Benefit[]>> {
    const params = getFindManyParams<Prisma.AssociatedWhereInput>(payload);

    const result = await this.prismaBenefitRepository.findMany({
      ...params,
      include: {
        affiliation: true,
        associated: true,
        consultant: true,
      },
    });
    const totalResults =
      JSON.stringify(params?.where) !== '{}'
        ? result.length
        : await this.prismaBenefitRepository.count();

    return parsePaginatedResult<Benefit[], Prisma.AssociatedWhereInput>(
      result,
      totalResults,
      payload,
    );
  }

  public async findById(id: number): Promise<Benefit | null> {
    const result = await this.prismaBenefitRepository.findFirst({
      where: { id },
      include: {
        affiliation: true,
        associated: true,
        consultant: true,
      },
    });

    return result;
  }

  public async create(payload: Prisma.BenefitCreateInput): Promise<Benefit> {
    const result = await this.prismaBenefitRepository.create({
      data: {
        ...payload,
        BenefitHistory: {
          create: {
            createdBy: payload.createdBy,
            adjustment: payload as JsonObject,
          },
        },
      },
      include: {
        BenefitHistory: true,
      },
    });

    return result;
  }

  public async updateById(
    id: number,
    payload: Prisma.BenefitUpdateInput,
  ): Promise<void> {
    await this.prismaBenefitRepository.update({
      where: { id },
      data: payload,
    });
  }

  public async deleteById(id: number): Promise<void> {
    await this.prismaBenefitRepository.delete({ where: { id } });
  }

  public async countEditTimes(id: number): Promise<number> {
    const result = await this.prismaBenefitHistoryRepository.count({
      where: { id, adjustmentType: BenefitAdjustmentType.POSTPONEMENT },
    });

    return result;
  }
}
