import {
  Prisma,
  Benefit,
  PrismaClient,
  BenefitAdjustmentType,
  InstallmentStatus,
} from '@prisma/client';
import { IPrismaTransactionClient } from 'src/interfaces/infra/IPrismaTranscationClient';
import { JsonObject } from 'swagger-ui-express';

import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import {
  getFindManyParams,
  parsePaginatedResult,
} from '../../shared/pagination/service';
import {
  EnrichedBenefit,
  IBenefitFiltersPayload,
  IBenefitRepository,
} from './interfaces';

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

  private formatFindAllBenefitsFilters({
    affiliation,
    associated,
    consultant,
    contractModel,
    contractType,
    installmentNumber,
    publicAgency,
  }: IBenefitFiltersPayload): Prisma.BenefitWhereInput {
    return {
      ...(associated ? { associated: { name: { contains: associated } } } : {}),
      ...(affiliation
        ? { affiliation: { name: { contains: affiliation } } }
        : {}),
      ...(consultant ? { consultant: { name: { contains: consultant } } } : {}),
      ...(contractModel ? { contractModel: { equals: contractModel } } : {}),
      ...(contractType ? { contractType: { equals: contractType } } : {}),
      ...(installmentNumber
        ? { installmentNumber: { equals: Number(installmentNumber) } }
        : {}),
      ...(publicAgency ? { publicAgency: { contains: publicAgency } } : {}),
    };
  }

  public async findAll(
    payload?: IFindAllParams & Prisma.BenefitWhereInput,
  ): Promise<IPaginatedAResult<EnrichedBenefit[]>> {
    const { page, resultsPerPage, ...filters } = payload || {};
    const params = {
      ...getFindManyParams<Prisma.BenefitWhereInput>({
        page,
        resultsPerPage,
      }),
      where: {
        ...this.formatFindAllBenefitsFilters(filters as IBenefitFiltersPayload),
      },
    };

    const result = await this.prismaBenefitRepository.findMany({
      ...params,
      include: {
        affiliation: true,
        associated: true,
        consultant: true,
        installments: {
          where: {
            status: {
              notIn: [InstallmentStatus.CANCELED],
            },
          },
        },
      },
    });
    const totalResults =
      JSON.stringify(params?.where) !== '{}'
        ? result.length
        : await this.prismaBenefitRepository.count();

    return parsePaginatedResult<EnrichedBenefit[], Prisma.BenefitWhereInput>(
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
        installments: {
          orderBy: {
            referenceDate: 'asc',
          },
          where: {
            status: {
              not: InstallmentStatus.CANCELED,
            },
          },
        },
      },
    });

    return result;
  }

  public async create(
    payload: Prisma.BenefitCreateInput,
    prisma?: IPrismaTransactionClient,
  ): Promise<Benefit> {
    const result = await (
      prisma?.benefit || this.prismaBenefitRepository
    ).create({
      data: {
        ...payload,
        benefitHistory: {
          create: {
            createdBy: payload.createdBy,
            adjustment: payload as JsonObject,
          },
        },
      },
      include: {
        benefitHistory: true,
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

  public async addItemToBenefitHistory({
    adjustment,
    adjustmentType,
    benefitId,
    createdBy,
  }: {
    benefitId: number;
    createdBy: string;
    adjustmentType: BenefitAdjustmentType;
    adjustment: JsonObject;
  }): Promise<void> {
    await this.prismaBenefitHistoryRepository.create({
      data: {
        adjustment,
        adjustmentType,
        benefitId,
        createdBy,
      },
    });
  }

  public async countEditTimes(benefitId: number): Promise<number> {
    const result = await this.prismaBenefitHistoryRepository.count({
      where: { benefitId, adjustmentType: BenefitAdjustmentType.POSTPONEMENT },
    });

    return result;
  }
}
