/* eslint-disable @typescript-eslint/no-unused-vars */
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
        phoneNumbers: true,
        references: true,
        addresses: {
          orderBy: {
            isDefault: 'desc',
          },
        },
        employmentRelationships: {
          orderBy: {
            isDefault: 'desc',
          },
        },
        bankAccounts: {
          orderBy: {
            isDefault: 'desc',
          },
        },
        benefits: {
          include: {
            affiliation: true,
            consultant: true,
          },
        },
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
        phoneNumbers: true,
        references: true,
        addresses: {
          orderBy: {
            isDefault: 'desc',
          },
        },
        employmentRelationships: {
          orderBy: {
            isDefault: 'desc',
          },
        },
        bankAccounts: {
          orderBy: {
            isDefault: 'desc',
          },
        },
        benefits: {
          include: {
            affiliation: true,
            consultant: true,
          },
        },
        affiliations: true,
      },
    });

    return result;
  }

  public async create(
    payload: ICreateAssociatedInput,
  ): Promise<Omit<IAssociated, 'benefits'>> {
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
        fullName: `${associated.name} ${associated.lastName}`,
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
        phoneNumbers: true,
        references: true,
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

    if (affiliations?.length) {
      await this.prismaRepository.update({
        where: { id },
        data: {
          affiliations: {
            set: [],
          },
        },
      });
    }

    if (associated.name || associated.lastName) {
      await this.prismaRepository.update({
        where: { id },
        data: {
          ...associated,
          fullName: `${associated.name} ${associated.lastName}`,
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
      const employmentRelationshipAlreadyExists =
        await MySqlDBClient.getInstance()
          .getPrismaClientInstance()
          .employmentRelationship.findFirst({
            where: { id: employmentRelationshipId },
          });

      if (!employmentRelationshipAlreadyExists) {
        const result = await MySqlDBClient.getInstance()
          .getPrismaClientInstance()
          .employmentRelationship.create({
            data: {
              ...payload,
              Associated: {
                connect: {
                  id: associatedId,
                },
              },
            } as Prisma.EmploymentRelationshipCreateInput,
          });

        return result;
      }

      const result = await MySqlDBClient.getInstance()
        .getPrismaClientInstance()
        .employmentRelationship.update({
          where: { id: employmentRelationshipId },
          data: {
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
      const bankAlreadyExists = await MySqlDBClient.getInstance()
        .getPrismaClientInstance()
        .bankAccount.findFirst({ where: { id: bankId } });

      if (!bankAlreadyExists) {
        const result = await MySqlDBClient.getInstance()
          .getPrismaClientInstance()
          .bankAccount.create({
            data: {
              ...payload,
              Associated: {
                connect: {
                  id: associatedId,
                },
              },
            } as Prisma.BankAccountCreateInput,
          });

        return result;
      }
      const result = await MySqlDBClient.getInstance()
        .getPrismaClientInstance()
        .bankAccount.update({
          where: { id: bankId },
          data: {
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
      const addressAlreadyExists = await MySqlDBClient.getInstance()
        .getPrismaClientInstance()
        .address.findFirst({ where: { id: addressId } });

      if (!addressAlreadyExists) {
        const result = await MySqlDBClient.getInstance()
          .getPrismaClientInstance()
          .address.create({
            data: {
              ...payload,
              Associated: {
                connect: {
                  id: associatedId,
                },
              },
            } as Prisma.AddressCreateInput,
          });

        return result;
      }

      const result = await MySqlDBClient.getInstance()
        .getPrismaClientInstance()
        .address.update({
          where: { id: addressId },
          data: {
            ...payload,
          },
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
