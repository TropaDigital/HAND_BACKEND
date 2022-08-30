import {
  Address,
  Affiliation,
  Associated,
  BankAccount,
  EmploymentRelationship,
  Prisma,
} from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';

export type IAssociated = Associated & {
  bankAccounts: BankAccount[];
  addresses: Address[];
  employmentRelationships: EmploymentRelationship[];
  affiliations: Affiliation[];
};

export type ICreateAssociatedInput = Omit<
  Prisma.AssociatedCreateInput,
  'addresses' | 'employmentRelationships' | 'bankAccounts' | 'affiliations'
> & {
  affiliations: Affiliation[];
  addresses: Omit<Address, 'id' | 'associatedId'>[];
  bankAccounts: Omit<BankAccount, 'id' | 'associatedId'>[];
  employmentRelationships: Omit<
    EmploymentRelationship,
    'id' | 'associatedId'
  >[];
};

export type IUpdateAssociatedInput = Omit<
  Prisma.AssociatedUpdateInput,
  'addresses' | 'employmentRelationships' | 'bankAccounts' | 'affiliations'
> & {
  affiliations?: Affiliation[];
  bankAccounts?: Omit<BankAccount, 'id' | 'associatedId'>[];
  addresses?: Omit<Address, 'id' | 'associatedId'>[];
  employmentRelationships?: Omit<
    EmploymentRelationship,
    'id' | 'associatedId'
  >[];
};

export interface IAssociatedRepository {
  create(payload: ICreateAssociatedInput): Promise<IAssociated>;

  updateById(id: number, payload: IUpdateAssociatedInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  getEmploymentRelationshipsByAssociatedId(
    associatedId: number,
  ): Promise<EmploymentRelationship[]>;

  upsertEmploymentRelationshipById(
    associatedId: number,
    employmentRelationshipId: number,
    payload:
      | Prisma.EmploymentRelationshipUpdateInput
      | Prisma.EmploymentRelationshipCreateInput,
  ): Promise<EmploymentRelationship>;

  getAddressesByAssociatedId(associatedId: number): Promise<Address[]>;

  getBankAccountsByAssociatedId(associatedId: number): Promise<BankAccount[]>;

  upsertAddressById(
    associatedId: number,
    employmentRelationshipId: number,
    payload: Prisma.AddressUpdateInput | Prisma.AddressCreateInput,
  ): Promise<Address>;

  upsertBankAccountById(
    associatedId: number,
    bankId: number,
    payload: Prisma.BankAccountUpdateInput | Prisma.BankAccountCreateInput,
  ): Promise<BankAccount>;

  findAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<IAssociated[]>>;

  findById(id: number): Promise<IAssociated | null>;
}

export interface IAssociatedController {
  getAll(
    httpRequest: IApiHttpRequest<
      unknown,
      unknown,
      unknown,
      IFindAllParams & Prisma.AssociatedWhereInput
    >,
  ): Promise<IApiHttpResponse<IPaginatedAResult<IAssociated[]>>>;

  getById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<IAssociated | null>>;

  create(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<IAssociated>>;

  updateById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  getBankAccountsByAssociatedId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<BankAccount[]>>;

  getEmploymentRelationshipsByAssociatedId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<EmploymentRelationship[]>>;

  updateEmploymentRelationshipsByAssociatedIdAndId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<unknown>>;

  updateBankAccountByAssociatedIdAndId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<unknown>>;

  getAddressesByAssociatedId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Address[]>>;

  updateAddressByAssociatedIdAndId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<unknown>>;
}

export interface IAssociatedService {
  getAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<IAssociated[]>>;

  getById(id: number): Promise<IAssociated | null>;

  create(payload: ICreateAssociatedInput): Promise<IAssociated>;

  updateById(id: number, payload: IUpdateAssociatedInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  deleteById(id: number): Promise<void>;

  upsertEmploymentRelationshipById(
    associatedId: number,
    employmentRelationshipId: number,
    payload:
      | Prisma.EmploymentRelationshipUpdateInput
      | Prisma.EmploymentRelationshipCreateInput,
  ): Promise<EmploymentRelationship>;

  getEmploymentRelationshipsByAssociatedId(
    associatedId: number,
  ): Promise<EmploymentRelationship[]>;

  upsertAddressById(
    associatedId: number,
    addressId: number,
    payload: Prisma.AddressUpdateInput | Prisma.AddressCreateInput,
  ): Promise<Address>;

  getAddressesByAssociatedId(associatedId: number): Promise<Address[]>;

  getBankAccountByAssociatedId(associatedId: number): Promise<BankAccount[]>;

  upsertBankAccountById(
    associatedId: number,
    bankId: number,
    payload: Prisma.BankAccountUpdateInput | Prisma.BankAccountCreateInput,
  ): Promise<BankAccount>;
}
