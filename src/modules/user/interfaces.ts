import { User, Prisma } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';

export interface IUserRepository {
  create(payload: Prisma.UserCreateInput): Promise<User>;

  updateById(id: number, payload: Prisma.UserUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  findAll(): Promise<User[]>;

  findById(id: number): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;
}

export interface IUserController {
  getAll(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<User[]>>;

  getByEmail(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<User | null>>;

  create(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<User>>;

  updateById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;
}

export interface IUserService {
  getAll(): Promise<User[]>;

  getByEmail(email: string): Promise<User | null>;

  getById(id: number): Promise<User | null>;

  create(payload: Prisma.UserCreateInput): Promise<User>;

  updateById(id: number, payload: Prisma.UserUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;
}
