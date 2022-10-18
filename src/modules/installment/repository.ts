import { Prisma, Installment, PrismaClient } from '@prisma/client';

import { IInstallmentRepository } from './interfaces';

export type PrismaInstallmentRepository = Prisma.InstallmentDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export class InstallmentRepository implements IInstallmentRepository {
  private readonly prismaRepository: PrismaInstallmentRepository;

  constructor(private readonly prismaClient: PrismaClient) {
    this.prismaRepository = prismaClient.installment;
  }

  public async findAll(payload?: {
    benefitId: number;
    justActiveInstallments: boolean;
  }): Promise<Installment[]> {
    const query = payload?.justActiveInstallments
      ? {
        where: {
          benefitId: payload?.benefitId,
          disabledAt: null,
          disabledBy: null,
        },
      }
      : {
        where: {
          benefitId: payload?.benefitId,
        },
      };
    const result = await this.prismaRepository.findMany({
      where: {
        ...query.where,
      },
    });

    return result;
  }

  public async findByBenefitIdAndReference(
    benefitId: number,
    reference: string,
  ): Promise<Installment | null> {
    const result = await this.prismaRepository.findFirst({
      where: {
        benefitId,
        reference,
        disabledAt: null,
        disabledBy: null,
      },
    });

    return result;
  }

  public async createMany(
    payload: Prisma.InstallmentCreateManyInput[],
  ): Promise<void> {
    await this.prismaRepository.createMany({
      data: payload,
    });
  }

  public async disable(id: number, user: string): Promise<void> {
    await this.prismaRepository.update({
      where: { id },
      data: { disabledAt: new Date(), disabledBy: user },
    });
  }

  public async softUpdate(
    id: number,
    { user, ...payload }: Prisma.InstallmentCreateInput & { user: string },
  ): Promise<void> {
    await this.prismaClient.$transaction([
      this.prismaRepository.update({
        where: { id },
        data: { disabledAt: new Date(), disabledBy: user },
      }),
      this.prismaRepository.create({
        data: {
          ...payload,
          createdBy: user,
        },
      }),
    ]);
  }
}
