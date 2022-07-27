import { EmploymentRelationship, Prisma } from '@prisma/client';

import MySqlDBClient from '../../infra/mySql';
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

  public async getEmploymentRelationshipsByAssociatedId(
    associatedId: number,
  ): Promise<EmploymentRelationship[]> {
    const employmentRelationships = await MySqlDBClient.getInstance()
      .getPrismaClientInstance()
      .employmentRelationship.findMany({
        where: {
          associatedId,
        },
      });

    return employmentRelationships;
  }

  public async findAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<IAssociated[]>> {
    const params = getFindManyParams<Prisma.AssociatedWhereInput>(payload);

    const result = await this.prismaRepository.findMany({
      ...params,
      include: { addresses: true, employmentRelationships: true },
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
      include: { addresses: true, employmentRelationships: true },
    });

    return result;
  }

  public async create(payload: ICreateAssociatedInput): Promise<IAssociated> {
    const { addresses, employmentRelationships, ...associated } = payload;

    const result = await this.prismaRepository.create({
      data: {
        ...associated,
        addresses: { createMany: { data: addresses } },
        employmentRelationships: {
          createMany: { data: employmentRelationships },
        },
      },
      include: { addresses: true, employmentRelationships: true },
    });

    return result;
  }

  public async updateById(
    id: number,
    payload: Partial<IUpdateAssociatedInput>,
  ): Promise<void> {
    const { addresses, employmentRelationships, ...associated } = payload;

    await this.prismaRepository.update({
      where: { id },
      data: associated,
    });
  }

  public async upsertEmploymentRelationshipById(
    associatedId: number,
    employmentRelationshipId: number,
    payload:
      | Prisma.EmploymentRelationshipUpdateInput
      | Prisma.EmploymentRelationshipCreateInput,
  ): Promise<EmploymentRelationship> {
    const result = await MySqlDBClient.getInstance()
      .getPrismaClientInstance()
      .employmentRelationship.upsert({
        where: { id: employmentRelationshipId },
        create: {
          ...payload,
          Associated: {
            connect: {
              id: associatedId,
            },
          },
        } as Prisma.EmploymentRelationshipCreateInput,
        update: {
          ...payload,
        } as Prisma.EmploymentRelationshipUpdateInput,
      });

    return result;
  }

  public async deleteById(id: number): Promise<void> {
    await this.prismaRepository.delete({ where: { id } });
  }
}
