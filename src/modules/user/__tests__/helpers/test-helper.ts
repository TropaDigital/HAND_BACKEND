import { User, Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { IApiHttpRequest, IApiHttpResponse } from '../../../../interfaces/http';
import { IValidator } from '../../../../interfaces/validation/IValidator';
import { IAuthenticationService } from '../../../../shared/auth/interfaces';
import { IMailerService } from '../../../../shared/mailer/interfaces';
import { IUserRepository, IUserService, IResponseUser } from '../../interfaces';
import { PrismaUserRepository } from '../../repository';

export const makeFakeCreateUserInput = (
  payload?: Partial<Prisma.UserCreateInput>,
): jest.Mocked<Prisma.UserCreateInput> => ({
  name: 'any_name',
  userName: 'any_user_name',
  email: 'any_email@mail.com',
  role: {},
  status: 'ACTIVE',
  password: 'any_password',
  ...payload,
});

export const makeFakeUpdateUserInput = (
  payload?: Partial<Omit<User, 'id'>>,
): jest.Mocked<Partial<Omit<User, 'id'>>> => ({
  name: 'any_name',
  userName: 'any_user_name',
  email: 'any_email@mail.com',
  status: 'ACTIVE',
  password: 'any_password',
  ...payload,
});

export const makeFakeApiHttpRequest = ({
  body,
  params,
  headers,
}: {
  body?: unknown;
  params?: { [key: string]: any };
  headers?: { [key: string]: string | string[] | undefined };
}): jest.Mocked<IApiHttpRequest> => ({ body, params, headers });

export const makeFakeApiHttpResponse = (
  status: keyof typeof StatusCodes,
  body?: unknown,
): jest.Mocked<IApiHttpResponse> => ({
  body,
  statusCodeAsString: status || 'OK',
});

export const makeFakeUser = (payload: Partial<User>): jest.Mocked<User> => ({
  id: 0,
  userName: 'any_user',
  name: 'any_name',
  email: 'any_email@mail.com',
  roleId: 1,
  status: 'ACTIVE',
  password: 'any_password',
  ...payload,
});

export const makeResponseUser = (
  payload: Partial<IResponseUser>,
): jest.Mocked<IResponseUser> => ({
  id: 0,
  userName: 'any_user',
  name: 'any_name',
  email: 'any_email@mail.com',
  role: null,
  roleId: 1,
  status: 'ACTIVE',
  ...payload,
});

export const makeFakeUserList = () => [makeFakeUser({}), makeFakeUser({})];

export const makeUserServiceStub = (): jest.Mocked<IUserService> => ({
  getAll: jest.fn().mockResolvedValue(makeFakeUserList()),
  getByUserName: jest.fn().mockResolvedValue(makeResponseUser({})),
  create: jest.fn().mockResolvedValue(makeFakeUser({})),
  updateById: jest.fn(),
  deleteById: jest.fn(),
  generateAndSendLinkOfResetPassword: jest.fn(),
});

export const makeValidatorStub = (payload?: {
  [key: string]: unknown;
}): jest.Mocked<IValidator> => ({
  validateSchema: jest.fn().mockReturnValue({ id: 777, ...payload }),
});

export const makePrismaUserRepositoryStub =
  (): jest.Mocked<PrismaUserRepository> => {
    const result: jest.Mocked<Partial<PrismaUserRepository>> = {
      findMany: jest.fn().mockResolvedValue(makeFakeUserList()),
      findFirst: jest.fn().mockResolvedValue(makeFakeUser({})),
      create: jest.fn().mockResolvedValue(makeFakeUser({})),
      update: jest.fn(),
      delete: jest.fn(),
    };
    return result as jest.Mocked<PrismaUserRepository>;
  };

export const makeUserRepositoryStub = (): jest.Mocked<IUserRepository> => ({
  findAll: jest.fn().mockResolvedValue(makeFakeUserList()),
  findByUserName: jest.fn().mockResolvedValue(makeFakeUser({})),
  findById: jest.fn().mockResolvedValue(makeFakeUser({})),
  create: jest.fn().mockResolvedValue(makeFakeUser({})),
  updateById: jest.fn(),
  deleteById: jest.fn(),
  findByEmail: jest.fn().mockResolvedValue(makeFakeUser({})),
});

export const makeAuthServiceStub = (): jest.Mocked<IAuthenticationService> => ({
  compareHash: jest.fn().mockResolvedValue(true),
  decodeToken: jest.fn(),
  generateToken: jest.fn().mockResolvedValue('any_token'),
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
});

export const makeMailerServiceStub = (): jest.Mocked<IMailerService> => ({
  sendResetPasswordEmail: jest.fn(),
});
