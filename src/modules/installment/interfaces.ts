import { Prisma, Installment } from '@prisma/client';

export interface IInstallmentRepository {
  findAll(payload?: Prisma.InstallmentWhereInput): Promise<Installment[]>;
  findByBenefitIdAndReferenceDate(
    id: number,
    referenceDate: Date,
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
