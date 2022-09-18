import { Role, Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { IApiHttpRequest, IApiHttpResponse } from '../../../../interfaces/http';
import { IValidator } from '../../../../interfaces/validation/IValidator';
import { IRoleRepository, IRoleService } from '../../interfaces';
import { PrismaRoleRepository } from '../../repository';

export const makeFakeCreateRoleInput = (
  payload?: Partial<Prisma.RoleCreateInput>,
): jest.Mocked<Prisma.RoleCreateInput> => ({
  name: 'USER',
  description: 'Some Description',
  ...payload,
});

export const makeFakeUpdateRoleInput = (
  payload?: Partial<Role>,
): jest.Mocked<Partial<Role>> => ({
  name: 'USER',
  description: 'Any description',
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

export const makeFakeRole = (payload: Partial<Role>): jest.Mocked<Role> => ({
  ...payload,
  id: 1,
  createdAt: new Date(),
  deletedAt: null,
  description: '',
  name: 'USER',
  updatedAt: new Date(),
  updatedBy: 'me',
});

export const makeFakeRoleList = () => [makeFakeRole({}), makeFakeRole({})];

export const makeRoleServiceStub = (): jest.Mocked<IRoleService> => ({
  getAll: jest.fn().mockResolvedValue(makeFakeRoleList()),
  getById: jest.fn().mockResolvedValue(makeFakeRole({})),
  create: jest.fn().mockResolvedValue(makeFakeRole({})),
  updateById: jest.fn(),
  deleteById: jest.fn(),
});

export const makeValidatorStub = (): jest.Mocked<IValidator> => ({
  validateSchema: jest.fn().mockReturnValue({ id: 777 }),
});

export const makePrismaRoleRepositoryStub =
  (): jest.Mocked<PrismaRoleRepository> => {
    const result: jest.Mocked<Partial<PrismaRoleRepository>> = {
      findMany: jest.fn().mockResolvedValue(makeFakeRoleList()),
      findFirst: jest.fn().mockResolvedValue(makeFakeRole({})),
      create: jest.fn().mockResolvedValue(makeFakeRole({})),
      update: jest.fn(),
      delete: jest.fn(),
    };
    return result as jest.Mocked<PrismaRoleRepository>;
  };

export const makeRoleRepositoryStub = (): jest.Mocked<IRoleRepository> => ({
  findAll: jest.fn().mockResolvedValue(makeFakeRoleList()),
  findById: jest.fn().mockResolvedValue(makeFakeRole({})),
  create: jest.fn().mockResolvedValue(makeFakeRole({})),
  updateById: jest.fn(),
  deleteById: jest.fn(),
});
