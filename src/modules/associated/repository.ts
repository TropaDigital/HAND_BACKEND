import { Prisma, Associated } from '@prisma/client';

import {
  IAssociatedFindAllParams,
  IPaginatedAssociatedResult,
} from '../../shared/pagination/interfaces';
import {
  getFindManyParams,
  parsePaginatedResult,
} from '../../shared/pagination/service';
import { IAssociatedRepository } from './interfaces';

export type PrismaAssociatedRepository = Prisma.AssociatedDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export class AssociatedRepository implements IAssociatedRepository {
  constructor(private readonly prismaRepository: PrismaAssociatedRepository) {}

  public async findAll(
    payload?: IAssociatedFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAssociatedResult<Associated[]>> {
    const params = getFindManyParams<Prisma.AssociatedWhereInput>(payload);

    const result = await this.prismaRepository.findMany(params);
    const totalResults = await this.prismaRepository.count();

    return parsePaginatedResult<Associated[], Prisma.AssociatedWhereInput>(
      result,
      totalResults,
      payload,
    );
  }

  public async findById(id: number): Promise<Associated | null> {
    const result = await this.prismaRepository.findFirst({
      where: { id },
    });

    return result;
  }

  public async create(
    payload: Prisma.AssociatedCreateInput,
  ): Promise<Associated> {
    const result = await this.prismaRepository.create({
      data: payload,
    });

    return result;
  }

  public async updateById(
    id: number,
    payload: Prisma.AssociatedUpdateInput,
  ): Promise<void> {
    await this.prismaRepository.update({
      where: { id },
      data: payload,
    });
  }

  public async deleteById(id: number): Promise<void> {
    await this.prismaRepository.delete({ where: { id } });
  }
}
