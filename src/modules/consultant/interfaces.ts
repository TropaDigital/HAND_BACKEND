import { Consultant, Prisma } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';

export interface IConsultantRepository {
  create(consultant: Prisma.ConsultantCreateInput): Promise<Consultant>;

  update(id: number, consultant: Prisma.ConsultantUpdateInput): Promise<void>;

  delete(id: number): Promise<void>;

  findAll(): Promise<Consultant[]>;

  findById(id: number): Promise<Consultant | null>;
}

export interface IConsultantController {
  getAllConsultants(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Consultant[]>>;

  getConsultantById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Consultant | null>>;

  createConsultant(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Consultant>>;

  updateConsultant(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>>;

  deleteConsultant(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>>;
}

export interface IConsultantService {
  getAllConsultants(): Promise<Consultant[]>;

  getConsultantById(id: number): Promise<Consultant | null>;

  createConsultant(
    consultant: Prisma.ConsultantCreateInput,
  ): Promise<Consultant>;

  updateConsultant(
    id: number,
    consultant: Prisma.ConsultantUpdateInput,
  ): Promise<void>;

  deleteConsultant(id: number): Promise<void>;
}
