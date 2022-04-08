import { Consultant, Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { IApiHttpRequest, IApiHttpResponse } from '../../../../interfaces/http';
import { IValidator } from '../../../../interfaces/validation/IValidator';
import { IConsultantService } from '../../interfaces';

export const makeFakeCreateConsultantInput =
  (): jest.Mocked<Prisma.ConsultantCreateInput> => ({
    name: 'any_name',
    taxId: '00000000000',
    city: 'any_city',
    state: 'any_state',
    commission: 10,
    createdBy: 'any_user',
  });

export const makeFakeUpdateConsultantInput = (): jest.Mocked<
  Partial<Omit<Consultant, 'id'>>
> => ({
  name: 'any_name',
  taxId: '00000000000',
  city: 'any_city',
  state: 'any_state',
  commission: 10,
  createdBy: 'any_user',
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
  name = 'any_name',
): jest.Mocked<Consultant> => ({
  id: 777,
  name,
  taxId: '00000000000',
  city: 'any_city',
  state: 'any_state',
  commission: 1000,
  createdBy: 'any_user',
  updatedBy: 'any_date',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
});

export const makeFakeConsultantList = () => [
  makeFakeConsultant('any_name1'),
  makeFakeConsultant('any_name2'),
];

export const makeConsultantServiceStub =
  (): jest.Mocked<IConsultantService> => ({
    getAllConsultants: jest.fn().mockResolvedValue(makeFakeConsultantList()),
    getConsultantById: jest.fn().mockResolvedValue(makeFakeConsultant()),
    createConsultant: jest.fn().mockResolvedValue(makeFakeConsultant()),
    updateConsultant: jest.fn(),
    deleteConsultant: jest.fn(),
  });

export const makeValidatorStub = (): jest.Mocked<IValidator> => ({
  validateSchema: jest.fn().mockReturnValue({ id: 777 }),
});
