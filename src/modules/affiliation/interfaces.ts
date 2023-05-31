import { Address, Affiliation, Prisma } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';

export type IAffiliation = Omit<Affiliation, 'addressId'> & {
  address?: Partial<Address>;
};

export interface IAffiliationRepository {
  create(payload: Prisma.AffiliationCreateInput): Promise<Affiliation>;

  updateById(
    id: number,
    payload: Prisma.AffiliationUpdateInput & {
      address?: Partial<Address>;
    },
  ): Promise<void>;

  deleteById(id: number): Promise<void>;

  findAll(): Promise<Affiliation[]>;

  findById(id: number): Promise<Affiliation | null>;

  findByName(name: string): Promise<Affiliation | null>;
}

export interface IAffiliationController {
  getAll(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Affiliation[]>>;

  getById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Affiliation | null>>;

  create(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Affiliation>>;

  updateById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;
}

export interface IAffiliationService {
  getAll(): Promise<Affiliation[]>;

  getById(id: number): Promise<Affiliation | null>;

  create(payload: Affiliation & { address: Address }): Promise<Affiliation>;

  updateById(
    id: number,
    payload: Partial<Omit<IAffiliation, 'id'>>,
  ): Promise<void>;

  deleteById(id: number): Promise<void>;
}
