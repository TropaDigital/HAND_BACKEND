import { User, Prisma } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';

export type IResponseUser = Omit<User, 'password'>;
export interface IUserRepository {
  create(payload: Prisma.UserCreateInput): Promise<IResponseUser>;

  updateById(id: number, payload: Prisma.UserUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  findAll(): Promise<User[]>;

  findById(id: number): Promise<User | null>;

  findByUserName(userName: string): Promise<User | null>;
}

export interface IUserController {
  getAll(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<IResponseUser[]>>;

  getByUserName(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<IResponseUser | null>>;

  create(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Omit<User, 'password'>>>;

  updateById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;
}

export interface IUserService {
  getAll(): Promise<IResponseUser[]>;

  getByUserName(userName: string): Promise<IResponseUser | null>;

  create(payload: Prisma.UserCreateInput): Promise<IResponseUser>;

  updateById(id: number, payload: Prisma.UserUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;
}
