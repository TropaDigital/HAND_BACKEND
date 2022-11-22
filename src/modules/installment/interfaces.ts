import { Prisma, Installment, InstallmentStatus } from '@prisma/client';
import { IPrismaTransactionClient } from 'src/interfaces/infra/IPrismaTranscationClient';

export interface IInstallmentFiltersPayload {
  from: Date;
  to: Date;
  associated?: string;
  status?: InstallmentStatus;
}

export interface IInstallmentRepository {
  getInstallmentsByReferenceDate({
    from,
    to,
    associated,
    status,
  }: IInstallmentFiltersPayload): Promise<Installment[]>;
  updateInstallmentByBenefitIdAndInstallmentId(
    benefitId: number,
    installmentId: number,
    payload: Prisma.InstallmentUncheckedUpdateManyInput,
  ): Promise<void>;
  findInstallmentByBenefitIdAndInstallmentId(
    benefitId: number,
    installmentId: number,
  ): Promise<Installment | null>;
  findInstallmentByBenefitIdAndInstallmentIdAndStatus(
    benefitId: number,
    installmentId: number,
    status: InstallmentStatus,
  ): Promise<Installment | null>;
  findAll(payload?: {
    benefitId: number;
    justPendingInstallments: boolean;
  }): Promise<Installment[]>;
  findByBenefitIdAndReference(
    id: number,
    reference: string,
  ): Promise<Installment | null>;
  createMany(
    payload: Prisma.InstallmentCreateManyInput[],
    prisma?: IPrismaTransactionClient,
  ): Promise<void>;
  softUpdate(
    id: number,
    payload: Prisma.InstallmentCreateInput & { user: string },
  ): Promise<void>;
  disable(id: number, user: string): Promise<void>;
}

export interface IInstallmentService {
  createMany(payload: Prisma.InstallmentCreateManyInput[]): Promise<void>;
  update(id: number, payload: Prisma.InstallmentUpdateInput): Promise<void>;
}
