import { Prisma } from '@prisma/client';

import { IInstallmentRepository, IInstallmentService } from './interfaces';

export class InstallmentService implements IInstallmentService {
  constructor(private readonly installmentRepository: IInstallmentRepository) { }

  public async createMany(
    payload: Prisma.InstallmentCreateManyInput[],
  ): Promise<void> {
    await this.installmentRepository.createMany(payload);
  }

  public async update(
    id: number,
    payload: Prisma.InstallmentCreateInput & { user: string },
  ): Promise<void> {
    await this.installmentRepository.softUpdate(id, payload);
  }
}
