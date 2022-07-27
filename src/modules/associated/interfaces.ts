import {
  Address,
  Associated,
  EmploymentRelationship,
  Prisma,
} from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';

export type IAssociated = Associated & {
  addresses: Address[];
  employmentRelationships: EmploymentRelationship[];
};

export type ICreateAssociatedInput = Omit<
  Prisma.AssociatedCreateInput,
  'addresses' | 'employmentRelationships'
> & {
  addresses: Omit<Address, 'id' | 'associatedId'>[];
  employmentRelationships: Omit<
    EmploymentRelationship,
    'id' | 'associatedId'
  >[];
};

export type IUpdateAssociatedInput = Omit<
  Prisma.AssociatedUpdateInput,
  'addresses' | 'employmentRelationships'
> & {
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
  getEmploymentRelationshipsByAssociatedId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<EmploymentRelationship[]>>;
  updateEmploymentRelationshipsByAssociatedIdAndId(
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
}
