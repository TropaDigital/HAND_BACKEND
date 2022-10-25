import { Prisma, Installment, InstallmentStatus } from '@prisma/client';

export interface IInstallmentRepository {
  updateInstallmentByBenefitIdAndInstallmentId(
    benefitId: number,
    installmentId: number,
    payload: Prisma.InstallmentUncheckedUpdateManyInput,
  ): Promise<void>;
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
  createMany(payload: Prisma.InstallmentCreateManyInput[]): Promise<void>;
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
