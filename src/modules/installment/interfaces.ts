import { Prisma, Installment } from '@prisma/client';

export interface IInstallmentRepository {
  findAll(payload?: Prisma.InstallmentWhereInput): Promise<Installment[]>;
  findById(id: number): Promise<Installment | null>;
  create(payload: Prisma.InstallmentCreateInput): Promise<Installment>;
  disableById(id: number, user: string): Promise<Installment>;
}

export interface IInstallmentService {
  createInstallment(payload: Prisma.InstallmentCreateInput): Promise<void>;
  updateInstallment(
    id: number,
    payload: Prisma.InstallmentUpdateInput,
  ): Promise<void>;
}
