import { Benefit, BenefitType } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { IApiHttpRequest, IApiHttpResponse } from '../../../../interfaces/http';
import { IValidator } from '../../../../interfaces/validation/IValidator';
import {
  IBenefitRepository,
  IBenefitService,
  ICreateBenefitParams,
} from '../../interfaces';
import { PrismaBenefitRepository } from '../../repository';

export const makeFakeCreateBenefitInput = (
  payload?: Partial<ICreateBenefitParams>,
): jest.Mocked<ICreateBenefitParams> => ({
  associatedId: 1,
  association: 'Vitória',
  bank: 'Caixa Econômica',
  publicAgency: 'SSP',
  contractModel: '22123',
  installmentNumber: 10,
  initialDate: new Date(),
  financialAssistanceValue: 100,
  installmentValue: 200,
  consultantId: 1,
  createdBy: 'any_user',
  type: BenefitType.N,
  ...payload,
});

export const makeFakeUpdateBenefitInput = (
  payload?: Partial<Omit<Benefit, 'id'>>,
): jest.Mocked<Partial<Omit<Benefit, 'id'>>> => ({
  associatedId: 1,
  association: 'Vitória',
  bank: 'Caixa Econômica',
  publicAgency: 'SSP',
  contractModel: '22123',
  installmentNumber: 10,
  initialDate: new Date(),
  financialAssistanceValue: 100,
  installmentValue: 200,
  consultantId: 1,
  createdBy: 'any_user',
  type: BenefitType.N,
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

export const makeFakeBenefit = (
  payload: Partial<ICreateBenefitParams>,
): jest.Mocked<ICreateBenefitParams> => ({
  associatedId: 1,
  association: 'Vitória',
  bank: 'Caixa Econômica',
  publicAgency: 'SSP',
  contractModel: '22123',
  installmentNumber: 10,
  initialDate: new Date('2022-10-20'),
  financialAssistanceValue: 100,
  installmentValue: 200,
  consultantId: 1,
  createdBy: 'any_user',
  updatedBy: 'any_date',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  type: BenefitType.N,
  ...payload,
});

export const makeFakeBenefitList = () => [
  makeFakeBenefit({}),
  makeFakeBenefit({}),
];

export const makeBenefitServiceStub = (): jest.Mocked<IBenefitService> => ({
  getAll: jest.fn().mockResolvedValue(makeFakeBenefitList()),
  getById: jest.fn().mockResolvedValue(makeFakeBenefit({})),
  create: jest.fn().mockResolvedValue(makeFakeBenefit({})),
  updateById: jest.fn(),
  deleteById: jest.fn(),
});

export const makeValidatorStub = (): jest.Mocked<IValidator> => ({
  validateSchema: jest.fn().mockReturnValue({ id: 777 }),
});

export const makePrismaBenefitRepositoryStub =
  (): jest.Mocked<PrismaBenefitRepository> => {
    const result: jest.Mocked<Partial<PrismaBenefitRepository>> = {
      findMany: jest.fn().mockResolvedValue(makeFakeBenefitList()),
      findFirst: jest.fn().mockResolvedValue(makeFakeBenefit({})),
      create: jest.fn().mockResolvedValue(makeFakeBenefit({})),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn().mockResolvedValue(11),
    };
    return result as jest.Mocked<PrismaBenefitRepository>;
  };

export const makeBenefitRepositoryStub =
  (): jest.Mocked<IBenefitRepository> => ({
    findAll: jest.fn().mockResolvedValue(makeFakeBenefitList()),
    findById: jest.fn().mockResolvedValue(makeFakeBenefit({})),
    create: jest.fn().mockResolvedValue(makeFakeBenefit({})),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  });
