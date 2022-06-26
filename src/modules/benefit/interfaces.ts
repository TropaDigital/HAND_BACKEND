import { Benefit, Prisma } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';

export interface IBenefitRepository {
  create(payload: Prisma.BenefitCreateInput): Promise<Benefit>;

  updateById(id: number, payload: Prisma.BenefitUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  findAll(payload?: Prisma.AssociatedWhereInput): Promise<Benefit[]>;

  findById(id: number): Promise<Benefit | null>;
}

export interface IBenefitController {
  getAll(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Benefit[]>>;

  getById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Benefit | null>>;

  create(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Benefit>>;

  updateById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;
}

export interface IBenefitService {
  getAll(payload?: Prisma.AssociatedWhereInput): Promise<Benefit[]>;

  getById(id: number): Promise<Benefit | null>;

  create(payload: Prisma.BenefitCreateInput): Promise<Benefit>;

  updateById(id: number, payload: Prisma.BenefitUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;
}
