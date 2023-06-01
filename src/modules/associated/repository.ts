/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Address,
  BankAccount,
  EmploymentRelationship,
  PhoneNumber,
  Prisma,
  Reference,
  PrismaClient,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import ErrorCodes from '../../enums/ErrorCodes';
import { ConflictError, NotFoundError } from '../../shared/errors';
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

export type PrismaBankAccountRepository = Prisma.BankAccountDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export type PrismaEmploymentRelationshipRepository =
  Prisma.EmploymentRelationshipDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
export type PrismaAddressRepository = Prisma.AddressDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;
export class AssociatedRepository implements IAssociatedRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  public async deletePhoneNumbersByAssociatedId(
    associatedId: number,
  ): Promise<void> {
    await this.prismaClient.phoneNumber.deleteMany({ where: { associatedId } });
  }

  public async deleteReferencesByAssociatedId(
    associatedId: number,
  ): Promise<void> {
    await this.prismaClient.reference.deleteMany({ where: { associatedId } });
  }

  public async getBankAccountsByAssociatedId(
    associatedId: number,
  ): Promise<BankAccount[]> {
    const bankAccounts = await this.prismaClient.bankAccount.findMany({
      where: {
        associatedId,
      },
    });

    return bankAccounts;
  }

  public async getEmploymentRelationshipsByAssociatedId(
    associatedId: number,
  ): Promise<EmploymentRelationship[]> {
    const employmentRelationships =
      await this.prismaClient.employmentRelationship.findMany({
        where: {
          associatedId,
        },
      });

    return employmentRelationships;
  }

  public async getAddressesByAssociatedId(
    associatedId: number,
  ): Promise<Address[]> {
    const addresses = await this.prismaClient.address.findMany({
      where: {
        associatedId,
      },
    });

    return addresses;
  }

  public async findAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<IAssociated[]>> {
    const { benefits, ...formatedPayload } = payload || {};
    const params =
      getFindManyParams<Prisma.AssociatedWhereInput>(formatedPayload);
    const result = await this.prismaClient.associated.findMany({
      ...params,
      where: {
        ...params.where,
        benefits: (benefits as any)?.joinedTelemedicine
          ? { some: { joinedTelemedicine: true } }
          : undefined,
        ...(!(benefits as any)?.joinedTelemedicine &&
        !(typeof (benefits as any)?.joinedTelemedicine === 'undefined')
          ? {
              OR: [
                { benefits: undefined },
                { benefits: { every: { joinedTelemedicine: false } } },
              ],
            }
          : {}),
      },
      include: {
        phoneNumbers: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        references: {
          orderBy: {
            createdAt: 'asc',
          },
        },
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
            installments: true,
          },
        },
        affiliations: true,
      },
    });

    const totalResults =
      JSON.stringify(params?.where) !== '{}'
        ? result.length
        : await this.prismaClient.associated.count({
            where: {
              ...params.where,
              benefits: (benefits as any)?.joinedTelemedicine
                ? { some: { joinedTelemedicine: true } }
                : undefined,
              ...(!(benefits as any)?.joinedTelemedicine &&
              !(typeof (benefits as any)?.joinedTelemedicine === 'undefined')
                ? {
                    OR: [
                      { benefits: undefined },
                      { benefits: { every: { joinedTelemedicine: false } } },
                    ],
                  }
                : {}),
            },
          });

    return parsePaginatedResult<IAssociated[], Prisma.AssociatedWhereInput>(
      result,
      totalResults,
      payload,
    );
  }

  public async findById(id: number): Promise<IAssociated | null> {
    const result = await this.prismaClient.associated.findFirst({
      where: { id },
      include: {
        phoneNumbers: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        references: {
          orderBy: {
            createdAt: 'asc',
          },
        },
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
    try {
      const {
        addresses,
        employmentRelationships,
        bankAccounts,
        affiliations,
        references,
        phoneNumbers,
        ...associated
      } = payload;

      const result = await this.prismaClient.associated.create({
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
          phoneNumbers: { createMany: { data: phoneNumbers } },
          references: { createMany: { data: references } },
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
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError(
          `already exists a ${error.meta?.target} with the provide code`,
          ErrorCodes.CREATE_ASSOCIATED_ERROR_001,
        );
      }
      throw error;
    }
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
      phoneNumbers,
      references,
      ...associated
    } = payload;

    if (affiliations?.length) {
      await this.prismaClient.associated.update({
        where: { id },
        data: {
          affiliations: {
            set: [],
          },
        },
      });
    }

    if (associated.name || associated.lastName) {
      await this.prismaClient.associated.update({
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

    await this.prismaClient.associated.update({
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

  public async upsertPhoneNumberByAssociatedId(
    associatedId: number,
    phoneNumberId: number,
    payload: Prisma.PhoneNumberUpdateInput | Prisma.PhoneNumberCreateInput,
  ): Promise<PhoneNumber> {
    try {
      const phoneNumberAlreadyExists =
        await this.prismaClient.phoneNumber.findFirst({
          where: { id: phoneNumberId },
        });

      if (!phoneNumberAlreadyExists) {
        const result = await this.prismaClient.phoneNumber.create({
          data: {
            ...payload,
            associated: {
              connect: {
                id: associatedId,
              },
            },
          } as Prisma.PhoneNumberCreateInput,
        });

        return result;
      }

      const result = await this.prismaClient.phoneNumber.update({
        where: { id: phoneNumberId },
        data: {
          ...payload,
        } as Prisma.PhoneNumberUpdateInput,
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundError('associated not found with provided id');
      }

      throw error;
    }
  }

  public async upsertReferenceByAssociatedId(
    associatedId: number,
    referenceId: number,
    payload: Prisma.ReferenceUpdateInput | Prisma.ReferenceCreateInput,
  ): Promise<Reference> {
    try {
      const referenceAlreadyExists =
        await this.prismaClient.reference.findFirst({
          where: { id: referenceId },
        });

      if (!referenceAlreadyExists) {
        const result = await this.prismaClient.reference.create({
          data: {
            ...payload,
            associated: {
              connect: {
                id: associatedId,
              },
            },
          } as Prisma.ReferenceCreateInput,
        });

        return result;
      }

      const result = await this.prismaClient.reference.update({
        where: { id: referenceId },
        data: {
          ...payload,
        } as Prisma.ReferenceUpdateInput,
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundError('associated not found with provided id');
      }

      throw error;
    }
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
        await this.prismaClient.employmentRelationship.findFirst({
          where: { id: employmentRelationshipId },
        });

      if (!employmentRelationshipAlreadyExists) {
        const result = await this.prismaClient.employmentRelationship.create({
          data: {
            ...payload,
            associated: {
              connect: {
                id: associatedId,
              },
            },
          } as Prisma.EmploymentRelationshipCreateInput,
        });

        return result;
      }

      const result = await this.prismaClient.employmentRelationship.update({
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
      const bankAlreadyExists = await this.prismaClient.bankAccount.findFirst({
        where: { id: bankId },
      });

      if (!bankAlreadyExists) {
        const result = await this.prismaClient.bankAccount.create({
          data: {
            ...payload,
            associated: {
              connect: {
                id: associatedId,
              },
            },
          } as Prisma.BankAccountCreateInput,
        });

        return result;
      }
      const result = await this.prismaClient.bankAccount.update({
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
      const addressAlreadyExists = await this.prismaClient.address.findFirst({
        where: { id: addressId },
      });

      if (!addressAlreadyExists) {
        const result = await this.prismaClient.address.create({
          data: {
            ...payload,
            associated: {
              connect: {
                id: associatedId,
              },
            },
          } as Prisma.AddressCreateInput,
        });

        return result;
      }

      const result = await this.prismaClient.address.update({
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
    await this.prismaClient.associated.delete({ where: { id } });
  }
}
