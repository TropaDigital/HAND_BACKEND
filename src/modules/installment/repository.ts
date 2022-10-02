import { Prisma, Installment, PrismaClient } from '@prisma/client';

import { getFindManyParams } from '../../shared/pagination/service';
import { IInstallmentRepository } from './interfaces';

export type PrismaInstallmentRepository = Prisma.InstallmentDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export class InstallmentRepository implements IInstallmentRepository {
  private readonly prismaRepository: PrismaInstallmentRepository;

  constructor(private readonly prismaClient: PrismaClient) {
    this.prismaRepository = prismaClient.installment;
  }

  public async findAll(
    payload?: Prisma.InstallmentWhereInput | undefined,
  ): Promise<Installment[]> {
    const params = await getFindManyParams<Prisma.InstallmentWhereInput>({
      ...payload,
      disabledAt: null,
      disabledBy: null,
    });
    const result = await this.prismaRepository.findMany({
      ...params,
    });

    return result;
  }

  public async findByBenefitIdAndReferenceDate(
    benefitId: number,
    referenceDate: Date,
  ): Promise<Installment | null> {
    const result = await this.prismaRepository.findFirst({
      where: {
        benefitId,
        referenceDate,
        disabledAt: null,
        disabledBy: null,
      },
    });

    return result;
  }

  public async createMany(
    payload: Prisma.InstallmentCreateManyInput[],
  ): Promise<void> {
    await this.prismaRepository.createMany({
      data: payload,
    });
  }

  public async disable(id: number, user: string): Promise<void> {
    await this.prismaRepository.update({
      where: { id },
      data: { disabledAt: new Date(), disabledBy: user },
    });
  }

  public async softUpdate(
    id: number,
    payload: Prisma.InstallmentCreateInput & { user: string },
  ): Promise<void> {
    await this.prismaClient.$transaction([
      this.prismaRepository.update({
        where: { id },
        data: { disabledAt: new Date(), disabledBy: payload.user },
      }),
      this.prismaRepository.create({
        data: {
          ...payload,
        },
      }),
    ]);
  }
}
