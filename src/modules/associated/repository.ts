import {
  Address,
  BankAccount,
  EmploymentRelationship,
  Prisma,
} from '@prisma/client';

import MySqlDBClient from '../../infra/mySql';
import { NotFoundError } from '../../shared/errors';
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

  public async getBankAccountsByAssociatedId(
    associatedId: number,
  ): Promise<BankAccount[]> {
    const bankAccounts = await MySqlDBClient.getInstance()
      .getPrismaClientInstance()
      .bankAccount.findMany({
        where: {
          associatedId,
        },
      });

    return bankAccounts;
  }

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

  public async getAddressesByAssociatedId(
    associatedId: number,
  ): Promise<Address[]> {
    const addresses = await MySqlDBClient.getInstance()
      .getPrismaClientInstance()
      .address.findMany({
        where: {
          associatedId,
        },
      });

    return addresses;
  }

  public async findAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<IAssociated[]>> {
    const params = getFindManyParams<Prisma.AssociatedWhereInput>(payload);

    const result = await this.prismaRepository.findMany({
      ...params,
      include: {
        addresses: true,
        employmentRelationships: true,
        bankAccounts: true,
        benefits: true,
        affiliations: true,
      },
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
      include: {
        addresses: true,
        employmentRelationships: true,
        bankAccounts: true,
        benefits: true,
        affiliations: true,
      },
    });

    return result;
  }

  public async create(payload: ICreateAssociatedInput): Promise<IAssociated> {
    const {
      addresses,
      employmentRelationships,
      bankAccounts,
      affiliations,
      ...associated
    } = payload;

    const result = await this.prismaRepository.create({
      data: {
        ...associated,
        affiliations: {
          connect: [
            ...affiliations.map(association => ({
              id: association.id,
            })),
          ],
        },
        bankAccounts: { createMany: { data: bankAccounts } },
        addresses: { createMany: { data: addresses } },
        employmentRelationships: {
          createMany: { data: employmentRelationships },
        },
      },
      include: {
        addresses: true,
        employmentRelationships: true,
        bankAccounts: true,
        affiliations: true,
      },
    });

    return result;
  }

  public async updateById(
    id: number,
    payload: Partial<IUpdateAssociatedInput>,
  ): Promise<void> {
    const {
      addresses,
      employmentRelationships,
      bankAccounts,
      benefits,
      affiliations,
      ...associated
    } = payload;

    await this.prismaRepository.update({
      where: { id },
      data: {
        ...associated,
        affiliations: {
          connect: [
            ...(affiliations || []).map(affiliation => ({
              id: affiliation.id,
            })),
          ],
        },
      },
    });
  }

  public async upsertEmploymentRelationshipById(
    associatedId: number,
    employmentRelationshipId: number,
    payload:
      | Prisma.EmploymentRelationshipUpdateInput
      | Prisma.EmploymentRelationshipCreateInput,
  ): Promise<EmploymentRelationship> {
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundError('associated not found with provided id');
      }
      throw error;
    }
  }

  public async upsertBankAccountById(
    associatedId: number,
    bankId: number,
    payload: Prisma.BankAccountUpdateInput | Prisma.BankAccountCreateInput,
  ): Promise<BankAccount> {
    try {
      const result = await MySqlDBClient.getInstance()
        .getPrismaClientInstance()
        .bankAccount.upsert({
          where: { id: bankId },
          create: {
            ...payload,
            Associated: {
              connect: {
                id: associatedId,
              },
            },
          } as Prisma.BankAccountCreateInput,
          update: {
            ...payload,
          } as Prisma.BankAccountUpdateInput,
        });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundError('associated not found with provided id');
      }
      throw error;
    }
  }

  public async upsertAddressById(
    associatedId: number,
    addressId: number,
    payload: Prisma.AddressUpdateInput | Prisma.AddressCreateInput,
  ): Promise<Address> {
    try {
      const result = await MySqlDBClient.getInstance()
        .getPrismaClientInstance()
        .address.upsert({
          where: { id: addressId },
          create: {
            ...payload,
            Associated: {
              connect: {
                id: associatedId,
              },
            },
          } as Prisma.AddressCreateInput,
          update: {
            ...payload,
          } as Prisma.AddressUpdateInput,
        });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundError('associated not found with provided id');
      }
      throw error;
    }
  }

  public async deleteById(id: number): Promise<void> {
    await this.prismaRepository.delete({ where: { id } });
  }
}
