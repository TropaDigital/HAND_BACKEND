import { Prisma, Installment } from '@prisma/client';

export interface IInstallmentRepository {
  findAll(payload?: Prisma.InstallmentWhereInput): Promise<Installment[]>;
  findByBenefitIdAndReferenceDate(
    id: number,
    referenceDate: Date,
  ): Promise<Installment | null>;
  create(payload: Prisma.InstallmentCreateInput): Promise<Installment>;
  softUpdate(
    id: number,
    payload: Prisma.InstallmentCreateInput & { user: string },
  ): Promise<void>;
}

export interface IInstallmentService {
  create(payload: Prisma.InstallmentCreateInput): Promise<void>;
  update(id: number, payload: Prisma.InstallmentUpdateInput): Promise<void>;
}
