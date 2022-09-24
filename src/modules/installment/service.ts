import { Prisma } from '@prisma/client';

import { IInstallmentRepository, IInstallmentService } from './interfaces';

export class InstallmentService implements IInstallmentService {
  constructor(private readonly installmentRepository: IInstallmentRepository) {}

  public async createInstallment(
    payload: Prisma.InstallmentCreateInput,
  ): Promise<void> {
    await this.installmentRepository.create(payload);
  }

  public async updateInstallment(
    id: number,
    payload: Prisma.InstallmentCreateInput & { user: string },
  ): Promise<void> {
    await this.installmentRepository.disableById(id, payload.user);
    await this.installmentRepository.create({ ...payload });
  }
}
