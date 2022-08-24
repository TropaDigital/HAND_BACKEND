import { Role, Prisma } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';

export interface IRoleRepository {
  create(payload: Prisma.RoleCreateInput): Promise<Role>;

  updateById(id: number, payload: Prisma.RoleUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  findAll(): Promise<Role[]>;

  findById(id: number): Promise<Role | null>;
}

export interface IRoleController {
  getAll(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Role[]>>;

  getById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Role | null>>;

  create(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<Role>>;

  updateById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;
}

export interface IRoleService {
  getAll(): Promise<Role[]>;

  getById(id: number): Promise<Role | null>;

  create(payload: Prisma.RoleCreateInput): Promise<Role>;

  updateById(id: number, payload: Prisma.RoleUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;
}
