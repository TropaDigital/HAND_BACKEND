import { Prisma, Installment } from '@prisma/client';

import { getFindManyParams } from '../../shared/pagination/service';
import { IInstallmentRepository } from './interfaces';

export type PrismaInstallmentRepository = Prisma.InstallmentDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export class InstallmentRepository implements IInstallmentRepository {
  constructor(private readonly prismaRepository: PrismaInstallmentRepository) {}

  public async findAll(
    payload?: Prisma.InstallmentWhereInput | undefined,
  ): Promise<Installment[]> {
    const params = getFindManyParams<Prisma.InstallmentWhereInput>({
      ...payload,
      disabledAt: null,
      disabledBy: null,
    });
    const result = await this.prismaRepository.findMany({
      ...params,
    });

    return result;
  }

  public async findById(id: number): Promise<Installment | null> {
    const result = await this.prismaRepository.findFirst({
      where: { id, disabledAt: null, disabledBy: null },
    });

    return result;
  }

  public async create(
    payload: Prisma.InstallmentCreateInput,
  ): Promise<Installment> {
    const result = await this.prismaRepository.create({
      data: {
        ...payload,
      },
    });

    return result;
  }

  public async disableById(id: number, user: string): Promise<void> {
    await this.prismaRepository.update({
      where: { id },
      data: { disabledAt: new Date(), disabledBy: user },
    });
  }
}
