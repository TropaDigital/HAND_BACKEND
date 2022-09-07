import {
  Address,
  BankAccount,
  EmploymentRelationship,
  Prisma,
} from '@prisma/client';

import { NotFoundError } from '../../shared/errors';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import {
  IAssociated,
  IAssociatedRepository,
  IAssociatedService,
  ICreateAssociatedInput,
  IUpdateAssociatedInput,
} from './interfaces';

export class AssociatedService implements IAssociatedService {
  constructor(private readonly associatedRepository: IAssociatedRepository) {}

  public async getBankAccountByAssociatedId(
    associatedId: number,
  ): Promise<BankAccount[]> {
    return this.associatedRepository.getBankAccountsByAssociatedId(
      associatedId,
    );
  }

  public async upsertBankAccountById(
    associatedId: number,
    bankId: number,
    payload: Prisma.BankAccountUpdateInput | Prisma.BankAccountCreateInput,
  ): Promise<BankAccount> {
    if (payload.isDefault) {
      const bankAccounts = await this.getBankAccountByAssociatedId(
        associatedId,
      );
      await Promise.all(
        bankAccounts.map(bankAccount => {
          return this.associatedRepository.upsertBankAccountById(
            associatedId,
            bankAccount.id,
            { isDefault: false },
          );
        }),
      );
    }

    const result = await this.associatedRepository.upsertBankAccountById(
      associatedId,
      bankId,
      payload,
    );

    return result;
  }

  public async getAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<IAssociated[]>> {
    const result = await this.associatedRepository.findAll(payload);

    return result;
  }

  public async getById(id: number): Promise<IAssociated | null> {
    const result = await this.associatedRepository.findById(id);
    if (!result) {
      throw new NotFoundError('associated not found with provided id');
    }
    return result;
  }

  public async create(payload: ICreateAssociatedInput): Promise<IAssociated> {
    const result = await this.associatedRepository.create({
      ...payload,
      addresses: [
        {
          ...payload.addresses[0],
          isDefault: true,
        },
      ],
      bankAccounts: [
        {
          ...payload.bankAccounts[0],
          isDefault: true,
        },
      ],
      employmentRelationships: [
        {
          ...payload.employmentRelationships[0],
          isDefault: true,
        },
      ],
    });

    return result;
  }

  public async updateById(
    id: number,
    payload: IUpdateAssociatedInput,
  ): Promise<void> {
    const associatedExists = await this.associatedRepository.findById(id);
    if (!associatedExists) {
      throw new NotFoundError('associated not found with provided id');
    }
    const result = await this.associatedRepository.updateById(id, payload);
    return result;
  }

  public async getEmploymentRelationshipsByAssociatedId(
    associatedId: number,
  ): Promise<EmploymentRelationship[]> {
    return this.associatedRepository.getEmploymentRelationshipsByAssociatedId(
      associatedId,
    );
  }

  public async getAddressesByAssociatedId(
    associatedId: number,
  ): Promise<Address[]> {
    return this.associatedRepository.getAddressesByAssociatedId(associatedId);
  }

  public async upsertEmploymentRelationshipById(
    associatedId: number,
    employmentRelationshipId: number,
    payload:
      | Prisma.EmploymentRelationshipUpdateInput
      | Prisma.EmploymentRelationshipCreateInput,
  ): Promise<EmploymentRelationship> {
    if (payload.isDefault) {
      const employmentRelationships =
        await this.getEmploymentRelationshipsByAssociatedId(associatedId);
      await Promise.all(
        employmentRelationships.map(employmentRelationship => {
          return this.associatedRepository.upsertEmploymentRelationshipById(
            associatedId,
            employmentRelationship.id,
            { isDefault: false },
          );
        }),
      );
    }

    const result =
      await this.associatedRepository.upsertEmploymentRelationshipById(
        associatedId,
        employmentRelationshipId,
        payload,
      );

    return result;
  }

  public async upsertAddressById(
    associatedId: number,
    addressId: number,
    payload: Prisma.AddressUpdateInput | Prisma.AddressCreateInput,
  ): Promise<Address> {
    if (payload.isDefault) {
      const addresses = await this.getAddressesByAssociatedId(associatedId);
      await Promise.all(
        addresses.map(address => {
          return this.associatedRepository.upsertAddressById(
            associatedId,
            address.id,
            { isDefault: false },
          );
        }),
      );
    }

    const result = await this.associatedRepository.upsertAddressById(
      associatedId,
      addressId,
      payload,
    );

    return result;
  }

  public async deleteById(id: number): Promise<void> {
    const associatedExists = await this.associatedRepository.findById(id);
    if (!associatedExists) {
      throw new NotFoundError('associated not found with provided id');
    }
    const result = await this.associatedRepository.deleteById(id);
    return result;
  }
}
