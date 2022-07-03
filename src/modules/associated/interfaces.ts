import { Associated, Prisma } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';

export interface IAssociatedRepository {
  create(payload: Prisma.AssociatedCreateInput): Promise<Associated>;

  updateById(id: number, payload: Prisma.AssociatedUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  findAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<Associated[]>>;

  findById(id: number): Promise<Associated | null>;
}

export interface IAssociatedController {
  getAll(
    httpRequest: IApiHttpRequest<
      unknown,
      unknown,
      unknown,
      IFindAllParams & Prisma.AssociatedWhereInput
    >,
  ): Promise<IApiHttpResponse<IPaginatedAResult<Associated[]>>>;

  getById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Associated | null>>;

  create(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Associated>>;

  updateById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;
}

export interface IAssociatedService {
  getAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<Associated[]>>;

  getById(id: number): Promise<Associated | null>;

  create(payload: Prisma.AssociatedCreateInput): Promise<Associated>;

  updateById(id: number, payload: Prisma.AssociatedUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;
}
