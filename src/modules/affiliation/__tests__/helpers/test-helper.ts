/* eslint-disable @typescript-eslint/no-explicit-any */
import { Affiliation, Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { IApiHttpRequest, IApiHttpResponse } from '../../../../interfaces/http';
import { IValidator } from '../../../../interfaces/validation/IValidator';
import { IAffiliationRepository, IAffiliationService } from '../../interfaces';
import { PrismaAffiliationRepository } from '../../repository';

export const makeFakeCreateAffiliationInput = (
  payload?: Partial<Prisma.AffiliationCreateInput>,
): jest.Mocked<Prisma.AffiliationCreateInput> => ({
  name: 'Any Affiliation',
  ...(payload as any),
});

export const makeFakeUpdateAffiliationInput = (
  payload?: Partial<Affiliation>,
): jest.Mocked<Partial<Affiliation>> => ({
  name: 'Some Affilation',
  deletedAt: new Date(),
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

export const makeFakeAffiliation = (
  payload: Partial<jest.Mocked<Affiliation>>,
): jest.Mocked<Affiliation> => ({
  id: 1,
  name: 'Some Affiliation',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  corporateTaxId: '35.882.309/0001-37',
  addressId: 1,
  ...payload,
});

export const makeFakeAffiliationList = (): Affiliation[] => [
  makeFakeAffiliation({}),
  makeFakeAffiliation({}),
];

export const makeAffiliationServiceStub =
  (): jest.Mocked<IAffiliationService> => ({
    getAll: jest.fn().mockResolvedValue(makeFakeAffiliationList()),
    getById: jest.fn().mockResolvedValue(makeFakeAffiliation({})),
    create: jest.fn().mockResolvedValue(makeFakeAffiliation({})),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  });

export const makeValidatorStub = (): jest.Mocked<IValidator> => ({
  validateSchema: jest.fn().mockReturnValue({ id: 777 }),
});

export const makePrismaAffiliationRepositoryStub =
  (): jest.Mocked<PrismaAffiliationRepository> => {
    const result: jest.Mocked<Partial<PrismaAffiliationRepository>> = {
      findMany: jest.fn().mockResolvedValue(makeFakeAffiliationList()),
      findFirst: jest.fn().mockResolvedValue(makeFakeAffiliation({})),
      create: jest.fn().mockResolvedValue(makeFakeAffiliation({})),
      update: jest.fn(),
      delete: jest.fn(),
    };
    return result as jest.Mocked<PrismaAffiliationRepository>;
  };

export const makeAffiliationRepositoryStub =
  (): jest.Mocked<IAffiliationRepository> => ({
    findAll: jest.fn().mockResolvedValue(makeFakeAffiliationList()),
    findById: jest.fn().mockResolvedValue(makeFakeAffiliation({})),
    create: jest.fn().mockResolvedValue(makeFakeAffiliation({})),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    findByName: jest.fn(),
  });
