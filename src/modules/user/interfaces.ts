import { User, Prisma } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';

export type ResponseUser = Omit<User, 'password'>;
export interface IUserRepository {
  create(payload: Prisma.UserCreateInput): Promise<ResponseUser>;

  updateById(id: number, payload: Prisma.UserUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  findAll(): Promise<User[]>;

  findById(id: number): Promise<User | null>;

  findByUserName(userName: string): Promise<User | null>;
}

export interface IUserController {
  getAll(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Omit<User, 'password'>[]>>;

  getByUserName(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<ResponseUser | null>>;

  create(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Omit<User, 'password'>>>;

  updateById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;

  deleteById(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<void>>;
}

export interface IUserService {
  getAll(): Promise<ResponseUser[]>;

  getByUserName(userName: string): Promise<ResponseUser | null>;

  create(payload: Prisma.UserCreateInput): Promise<ResponseUser>;

  updateById(id: number, payload: Prisma.UserUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;
}
