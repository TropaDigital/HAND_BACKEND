import {
  Prisma,
  Installment,
  PrismaClient,
  InstallmentStatus,
} from '@prisma/client';

import { IPrismaTransactionClient } from '../../interfaces/infra/IPrismaTranscationClient';
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
    justPendingInstallments: boolean;
  }): Promise<Installment[]> {
    const query = payload?.justPendingInstallments
      ? {
        where: {
          benefitId: payload?.benefitId,
          status: InstallmentStatus.PENDING,
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
      orderBy: {
        referenceDate: 'asc',
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
        status: {
          not: InstallmentStatus.CANCELED,
        },
      },
    });

    return result;
  }

  public async createMany(
    payload: Prisma.InstallmentCreateManyInput[],
    prisma?: IPrismaTransactionClient,
  ): Promise<void> {
    await (prisma?.installment || this.prismaRepository).createMany({
      data: payload,
    });
  }

  public async findInstallmentByBenefitIdAndInstallmentId(
    benefitId: number,
    installmentId: number,
  ): Promise<Installment | null> {
    const installment = await this.prismaRepository.findFirst({
      where: {
        benefitId,
        id: installmentId,
      },
    });

    return installment;
  }

  public async findInstallmentByBenefitIdAndInstallmentIdAndStatus(
    benefitId: number,
    installmentId: number,
    installmentStatus: InstallmentStatus,
  ): Promise<Installment | null> {
    const installment = await this.prismaRepository.findFirst({
      where: {
        benefitId,
        id: installmentId,
        status: installmentStatus,
      },
    });

    return installment;
  }

  public async updateInstallmentByBenefitIdAndInstallmentId(
    benefitId: number,
    installmentId: number,
    payload: Prisma.InstallmentUncheckedUpdateManyInput,
  ): Promise<void> {
    await this.prismaRepository.updateMany({
      where: {
        benefitId,
        id: installmentId,
      },
      data: {
        ...payload,
      },
    });
  }

  public async disable(id: number, user: string): Promise<void> {
    await this.prismaRepository.update({
      where: { id },
      data: {
        status: InstallmentStatus.CANCELED,
        updatedAt: new Date(),
        updatedBy: user,
      },
    });
  }

  public async softUpdate(
    id: number,
    { user, ...payload }: Prisma.InstallmentCreateInput & { user: string },
    prisma?: IPrismaTransactionClient,
  ): Promise<void> {
    await this.prismaClient.$transaction([
      (prisma?.installment || this.prismaRepository).update({
        where: { id },
        data: {
          status: InstallmentStatus.CANCELED,
          updatedAt: new Date(),
          updatedBy: user,
        },
      }),
      (prisma?.installment || this.prismaRepository).create({
        data: {
          ...payload,
          createdBy: user,
        },
      }),
    ]);
  }
}
