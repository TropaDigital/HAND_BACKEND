/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Benefit,
  BenefitAdjustmentType,
  BenefitType,
  Installment,
  Prisma,
} from '@prisma/client';
import { IPrismaTransactionClient } from 'src/interfaces/infra/IPrismaTranscationClient';
import { JsonObject } from 'swagger-ui-express';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import { IInstallmentFiltersPayload } from '../installment/interfaces';
import { ILoanSimulationBasedOnRequestedValueParams } from '../loanSimulation/interfaces';

export interface ICreateBenefitParams
  extends ILoanSimulationBasedOnRequestedValueParams {
  code?: string;
  type: BenefitType;
  affiliationId: number;
  associatedId: number;
  bankAccountId: number;
  employmentRelationshipId: number;
  addressId: number;
  createdBy: string;
}

export type EnrichedBenefit = Benefit & {
  pendingInstallmentsNumber: number;
  overdueInstallmentsNumber: number;
  openAmount: number;
  paidAmount: number;
  overdueStatus: 'overdue' | 'pending' | 'sent';
  installments: Installment[];
};

export interface IBenefitRepository {
  create(
    payload: Prisma.BenefitCreateInput,
    prisma?: IPrismaTransactionClient,
  ): Promise<Benefit>;

  updateById(id: number, payload: Prisma.BenefitUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  findAll(
    payload?: IFindAllParams & Prisma.BenefitWhereInput,
  ): Promise<IPaginatedAResult<EnrichedBenefit[]>>;

  findByCode(
    code: string,
    prisma?: IPrismaTransactionClient,
  ): Promise<Benefit | null>;
  findById(id: number): Promise<EnrichedBenefit | null>;

  countEditTimes(id: number): Promise<number>;

  addItemToBenefitHistory({
    adjustment,
    adjustmentType,
    benefitId,
    createdBy,
  }: {
    benefitId: number;
    createdBy: string;
    adjustmentType: BenefitAdjustmentType;
    adjustment: JsonObject;
  }): Promise<void>;

  getBenefitsByAssociatedId(
    associatedId: number,
    prisma?: IPrismaTransactionClient,
  ): Promise<Benefit[]>;
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

  dimissInstallMentByBenefitIdAndInstallmentId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>>;

  getPostponementSimulation(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse>;

  create(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Benefit>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;
  updateById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  adjustContractById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>>;

  getInstallmentsByReferenceDates(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Installment[]>>;

  getInstallmentBankInterfaceFile(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<any>>;
}

export interface IBenefitService {
  getInstallmentInfo(benefit: EnrichedBenefit): {
    overdueInstallmentsNumber: number;
    openAmount: number;
    paidAmount: number;
    overdueStatus: 'overdue' | 'pending' | 'sent';
  };
  getInstallmentsByReferenceDates({
    from,
    to,
    associated,
    status,
  }: IInstallmentFiltersPayload): Promise<Installment[]>;
  getAll(
    payload?: IFindAllParams & Prisma.BenefitWhereInput,
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

  updateInstallmentByBenefitIdAndInstallmentId(payload: {
    payload: Prisma.InstallmentUncheckedUpdateManyInput;
    benefitId: number;
    installmentId: number;
    user: string;
  }): Promise<void>;
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
