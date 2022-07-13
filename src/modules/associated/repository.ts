import { Prisma } from '@prisma/client';

import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import {
  getFindManyParams,
  parsePaginatedResult,
} from '../../shared/pagination/service';
import {
  IAssociated,
  IAssociatedRepository,
  ICreateAssociatedInput,
  IUpdateAssociatedInput,
} from './interfaces';

export type PrismaAssociatedRepository = Prisma.AssociatedDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export class AssociatedRepository implements IAssociatedRepository {
  constructor(private readonly prismaRepository: PrismaAssociatedRepository) {}

  public async findAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<IAssociated[]>> {
    const params = getFindManyParams<Prisma.AssociatedWhereInput>(payload);

    const result = await this.prismaRepository.findMany({
      ...params,
      include: { addresses: true },
    });
    const totalResults =
      JSON.stringify(params?.where) !== '{}'
        ? result.length
        : await this.prismaRepository.count();

    return parsePaginatedResult<IAssociated[], Prisma.AssociatedWhereInput>(
      result,
      totalResults,
      payload,
    );
  }

  public async findById(id: number): Promise<IAssociated | null> {
    const result = await this.prismaRepository.findFirst({
      where: { id },
      include: { addresses: true },
    });

    return result;
  }

  public async create(payload: ICreateAssociatedInput): Promise<IAssociated> {
    const { addresses, ...associated } = payload;

    const result = await this.prismaRepository.create({
      data: { ...associated, addresses: { createMany: { data: addresses } } },
      include: { addresses: true },
    });

    return result;
  }

  public async updateById(
    id: number,
    payload: Partial<IUpdateAssociatedInput>,
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
