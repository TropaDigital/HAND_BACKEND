import { Consultant, Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { IApiHttpRequest, IApiHttpResponse } from '../../../../interfaces/http';
import { IValidator } from '../../../../interfaces/validation/IValidator';
import { IConsultantRepository, IConsultantService } from '../../interfaces';
import { PrismaConsultantRepository } from '../../repository';

export const makeFakeCreateConsultantInput = (
  payload?: Partial<Prisma.ConsultantCreateInput>,
): jest.Mocked<Prisma.ConsultantCreateInput> => ({
  name: 'any_name',
  taxId: '00000000000',
  city: 'any_city',
  state: 'any_state',
  commission: 10,
  createdBy: 'any_user',
  ...payload,
});

export const makeFakeUpdateConsultantInput = (
  payload?: Partial<Omit<Consultant, 'id'>>,
): jest.Mocked<Partial<Omit<Consultant, 'id'>>> => ({
  name: 'any_name',
  taxId: '00000000000',
  city: 'any_city',
  state: 'any_state',
  commission: 10,
  createdBy: 'any_user',
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

export const makeFakeConsultant = (
  payload: Partial<Consultant>,
): jest.Mocked<Consultant> => ({
  id: 777,
  name: 'any_name',
  taxId: '00000000000',
  city: 'any_city',
  state: 'any_state',
  commission: 1000,
  createdBy: 'any_user',
  updatedBy: 'any_date',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  ...payload,
});

export const makeFakeConsultantList = () => [
  makeFakeConsultant({ name: 'any_name1' }),
  makeFakeConsultant({ name: 'any_name2' }),
];

export const makeConsultantServiceStub =
  (): jest.Mocked<IConsultantService> => ({
    getAll: jest.fn().mockResolvedValue(makeFakeConsultantList()),
    getById: jest.fn().mockResolvedValue(makeFakeConsultant({})),
    create: jest.fn().mockResolvedValue(makeFakeConsultant({})),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  });

export const makeValidatorStub = (): jest.Mocked<IValidator> => ({
  validateSchema: jest.fn().mockReturnValue({ id: 777 }),
});

export const makePrismaConsultantRepositoryStub =
  (): jest.Mocked<PrismaConsultantRepository> => {
    const result: jest.Mocked<Partial<PrismaConsultantRepository>> = {
      findMany: jest.fn().mockResolvedValue(makeFakeConsultantList()),
      findFirst: jest.fn().mockResolvedValue(makeFakeConsultant({})),
      create: jest.fn().mockResolvedValue(makeFakeConsultant({})),
      update: jest.fn(),
      delete: jest.fn(),
    };
    return result as jest.Mocked<PrismaConsultantRepository>;
  };

export const makeConsultantRepositoryStub =
  (): jest.Mocked<IConsultantRepository> => ({
    findAll: jest.fn().mockResolvedValue(makeFakeConsultantList()),
    findById: jest.fn().mockResolvedValue(makeFakeConsultant({})),
    create: jest.fn().mockResolvedValue(makeFakeConsultant({})),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  });
