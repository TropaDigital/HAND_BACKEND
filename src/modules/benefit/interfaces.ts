import { Benefit, BenefitType, Installment, Prisma } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import { ILoanSimulationBasedOnRequestedValueParams } from '../loanSimulation/interfaces';

export interface ICreateBenefitParams
  extends ILoanSimulationBasedOnRequestedValueParams {
  type: BenefitType;
  affiliationId: number;
  associatedId: number;
  bankAccountId: number;
  employmentRelationshipId: number;
  addressId: number;
  createdBy: string;
}

export interface IBenefitRepository {
  create(payload: Prisma.BenefitCreateInput): Promise<Benefit>;

  updateById(id: number, payload: Prisma.BenefitUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  findAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<Benefit[]>>;

  findById(id: number): Promise<Benefit | null>;

  countEditTimes(id: number): Promise<number>;
}

export interface IBenefitController {
  getAll(
    httpRequest: IApiHttpRequest<
      unknown,
      unknown,
      unknown,
      IFindAllParams & Prisma.BenefitWhereInput
    >,
  ): Promise<IApiHttpResponse<IPaginatedAResult<Benefit[]>>>;

  getById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Benefit | null>>;

  getPostponementSimulation(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse>;

  create(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Benefit>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  adjustContractById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>>;
}

export interface IBenefitService {
  getAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<Benefit[]>>;

  getById(id: number): Promise<Benefit | null>;

  create(payload: ICreateBenefitParams): Promise<Benefit>;

  getPostponementSimulation(
    benefitId: number,
    single: boolean,
  ): Promise<Installment[]>;

  postponementInstallment(payload: { id: number; user: string }): Promise<void>;

  singlePostponementInstallment(payload: {
    id: number;
    reference: Date;
    user: string;
  }): Promise<void>;

  updateById(id: number, payload: Prisma.BenefitUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;
}

export interface IBenefitFiltersPayload {
  associated?: string;
  affiliation?: string;
  publicAgency?: string;
  contractModel?: string;
  contractType?: string;
  installmentNumber?: number;
  consultant?: string;
}
