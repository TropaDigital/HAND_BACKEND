import { Benefit, Prisma } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';
import {
  IAssociatedFindAllParams,
  IPaginatedAssociatedResult,
} from '../../shared/pagination/interfaces';

export interface IBenefitRepository {
  create(payload: Prisma.BenefitCreateInput): Promise<Benefit>;

  updateById(id: number, payload: Prisma.BenefitUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  findAll(
    payload?: IAssociatedFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAssociatedResult<Benefit[]>>;

  findById(id: number): Promise<Benefit | null>;
}

export interface IBenefitController {
  getAll(
    httpRequest: IApiHttpRequest<
      unknown,
      unknown,
      unknown,
      IAssociatedFindAllParams & Prisma.BenefitWhereInput
    >,
  ): Promise<IApiHttpResponse<IPaginatedAssociatedResult<Benefit[]>>>;

  getById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Benefit | null>>;

  create(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Benefit>>;

  updateById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;
}

export interface IBenefitService {
  getAll(
    payload?: IAssociatedFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAssociatedResult<Benefit[]>>;

  getById(id: number): Promise<Benefit | null>;

  create(payload: Prisma.BenefitCreateInput): Promise<Benefit>;

  updateById(id: number, payload: Prisma.BenefitUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;
}
