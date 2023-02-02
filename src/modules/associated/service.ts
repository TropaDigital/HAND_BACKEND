import {
  Address,
  BankAccount,
  EmploymentRelationship,
  Prisma,
} from '@prisma/client';

import { generateInsertCode } from '../../shared/code';
import { NotFoundError } from '../../shared/errors';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import { EnrichedBenefit, IBenefitService } from '../benefit/interfaces';
import {
  IAssociated,
  IAssociatedRepository,
  IAssociatedService,
  ICreateAssociatedInput,
  IEnrichedAssociated,
  IUpdateAssociatedInput,
} from './interfaces';

export class AssociatedService implements IAssociatedService {
  constructor(
    private readonly associatedRepository: IAssociatedRepository,
    private readonly benefitService: IBenefitService,
  ) {}

  public async getBankAccountByAssociatedId(
    associatedId: number,
  ): Promise<BankAccount[]> {
    await this.getById(associatedId);
    return this.associatedRepository.getBankAccountsByAssociatedId(
      associatedId,
    );
  }

  public async upsertBankAccountById(
    associatedId: number,
    bankId: number,
    payload: Prisma.BankAccountUpdateInput | Prisma.BankAccountCreateInput,
  ): Promise<BankAccount> {
    await this.getById(associatedId);
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
  ): Promise<IPaginatedAResult<IEnrichedAssociated[]>> {
    const result = await this.associatedRepository.findAll(payload);

    return {
      ...result,
      data: result.data.map(associated => ({
        ...associated,
        benefits: associated.benefits.map(benefit => ({
          ...benefit,
          ...this.benefitService.getInstallmentInfo(benefit as EnrichedBenefit),
        })) as unknown[] as EnrichedBenefit[],
      })),
    };
  }

  public async getById(id: number): Promise<IAssociated | null> {
    const result = await this.associatedRepository.findById(id);
    if (!result) {
      throw new NotFoundError('associated not found with provided id');
    }
    return result;
  }

  public async create(
    payload: ICreateAssociatedInput,
  ): Promise<Omit<IAssociated, 'benefits'>> {
    const result = await this.associatedRepository.create({
      ...payload,
      code: generateInsertCode(),
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
    const {
      addresses,
      affiliations,
      bankAccounts,
      benefits,
      employmentRelationships,
      phoneNumbers,
      references,
      ...associated
    } = (await this.getById(id)) || {};
    const result = await this.associatedRepository.updateById(id, {
      ...associated,
      ...payload,
    });
    return result;
  }

  public async getEmploymentRelationshipsByAssociatedId(
    associatedId: number,
  ): Promise<EmploymentRelationship[]> {
    await this.getById(associatedId);
    return this.associatedRepository.getEmploymentRelationshipsByAssociatedId(
      associatedId,
    );
  }

  public async getAddressesByAssociatedId(
    associatedId: number,
  ): Promise<Address[]> {
    await this.getById(associatedId);
    return this.associatedRepository.getAddressesByAssociatedId(associatedId);
  }

  public async upsertEmploymentRelationshipById(
    associatedId: number,
    employmentRelationshipId: number,
    payload:
      | Prisma.EmploymentRelationshipUpdateInput
      | Prisma.EmploymentRelationshipCreateInput,
  ): Promise<EmploymentRelationship> {
    await this.getById(associatedId);
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
    await this.getById(associatedId);
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
    await this.getById(id);
    const result = await this.associatedRepository.deleteById(id);
    return result;
  }
}
