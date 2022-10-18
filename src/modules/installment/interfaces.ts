import { Prisma, Installment } from '@prisma/client';

export interface IInstallmentRepository {
  findAll(payload?: {
    benefitId: number;
    justActiveInstallments: boolean;
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
