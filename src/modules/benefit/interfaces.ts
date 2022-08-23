import { Benefit, Prisma } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';

export interface ICreateBenefitParams
  extends Omit<Prisma.BenefitCreateInput, 'associated' | 'consultant'> {
  associatedId: number;
  consultantId?: number;
}

export interface IBenefitRepository {
  create(payload: Prisma.BenefitCreateInput): Promise<Benefit>;

  updateById(id: number, payload: Prisma.BenefitUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  findAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<Benefit[]>>;

  findById(id: number): Promise<Benefit | null>;
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

  create(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Benefit>>;

  updateById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;
}

export interface IBenefitService {
  getAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<Benefit[]>>;

  getById(id: number): Promise<Benefit | null>;

  create(payload: ICreateBenefitParams): Promise<Benefit>;

  updateById(id: number, payload: Prisma.BenefitUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;
}
