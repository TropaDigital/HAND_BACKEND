import { User, Prisma, Role } from '@prisma/client';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';

export interface IResponseUser extends Omit<User, 'password'> {
  role: Role | null;
}

export type IUser = User & {
  role: Role | null;
};

export interface IUserRepository {
  create(payload: Prisma.UserCreateInput): Promise<IUser>;

  updateById(id: number, payload: Prisma.UserUpdateInput): Promise<void>;

  deleteById(id: number): Promise<void>;

  findAll(): Promise<IUser[]>;

  findById(id: number): Promise<IUser | null>;

  findByUserName(userName: string): Promise<IUser | null>;

  findByEmail(email: string): Promise<IUser | null>;
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

  generateAndSendLinkOfResetPassword(email: string): Promise<User>;
}
