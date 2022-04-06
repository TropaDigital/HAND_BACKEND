import { Consultant, Prisma } from '@prisma/client';

import { ApiHttpRequest, ApiHttpResponse } from '../../interfaces/http';

export interface IConsultantRepository {
  create(consultant: Prisma.ConsultantCreateInput): Promise<Consultant>;

  update(id: number, consultant: Prisma.ConsultantUpdateInput): Promise<void>;

  delete(id: number): Promise<void>;

  findAll(): Promise<Consultant[]>;

  findById(id: number): Promise<Consultant | null>;
}

export interface IConsultantController {
  getAllConsultants(
    httpRequest: ApiHttpRequest,
  ): Promise<ApiHttpResponse<Consultant[]>>;

  getConsultantById(
    httpRequest: ApiHttpRequest,
  ): Promise<ApiHttpResponse<Consultant | null>>;

  createConsultant(
    httpRequest: ApiHttpRequest,
  ): Promise<ApiHttpResponse<Consultant>>;

  updateConsultant(httpRequest: ApiHttpRequest): Promise<ApiHttpResponse<void>>;

  deleteConsultant(httpRequest: ApiHttpRequest): Promise<ApiHttpResponse<void>>;
}
