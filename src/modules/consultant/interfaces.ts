import { Consultant, Prisma } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';

export interface IConsultantRepository {
  create(consultant: Prisma.ConsultantCreateInput): Promise<Consultant>;

  updateById(
    id: number,
    consultant: Prisma.ConsultantUpdateInput,
  ): Promise<Consultant>;

  deleteById(id: number): Promise<void>;

  findAll(): Promise<Consultant[]>;

  findById(id: number): Promise<Consultant | null>;
}

export interface IConsultantController {
  getAll(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Consultant[]>>;

  getById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Consultant>>;

  create(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Consultant>>;

  updateById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;
}

export interface IConsultantService {
  getAll(): Promise<Consultant[]>;

  getById(id: number): Promise<Consultant>;

  create(consultant: Prisma.ConsultantCreateInput): Promise<Consultant>;

  updateById(
    id: number,
    consultant: Prisma.ConsultantUpdateInput,
  ): Promise<Consultant>;

  deleteById(id: number): Promise<void>;
}
