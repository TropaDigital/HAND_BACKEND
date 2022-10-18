import { Benefit, BenefitType, PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { MonthOfPayment } from '../../../../enums/MonthOfPayment';
import { IApiHttpRequest, IApiHttpResponse } from '../../../../interfaces/http';
import { IValidator } from '../../../../interfaces/validation/IValidator';
import { PrismaInstallmentRepository } from '../../../installment/repository';
import {
  IBenefitRepository,
  IBenefitService,
  ICreateBenefitParams,
} from '../../interfaces';
import { PrismaBenefitRepository } from '../../repository';

export const makeFakeCreateBenefitInput = (
  payload?: Partial<ICreateBenefitParams>,
): jest.Mocked<ICreateBenefitParams> => ({
  type: BenefitType.D,
  affiliationId: 1,
  associatedId: 2,
  bankAccountId: 1,
  employmentRelationshipId: 2,
  addressId: 2,
  requestedValue: 100,
  salary: 2000,
  monthOfPayment: MonthOfPayment.CURRENT_MONTH,
  numberOfInstallments: 4,
  hasGratification: false,
  joinedTelemedicine: false,
  administrationFeeValue: 0,
  ...(payload as any),
});

export const makeFakeUpdateBenefitInput = (
  payload?: Partial<Benefit & ICreateBenefitParams>,
): jest.Mocked<Partial<Benefit & ICreateBenefitParams>> => ({
  id: 777,
  type: BenefitType.D,
  affiliationId: 1,
  associatedId: 1,
  addressId: 2,
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
  type: BenefitType.D,
  affiliation: 'any affiliation',
  associatedId: 1,
  bankAccountId: 1,
  employmentRelationshipId: 2,
  addressId: 2,
  ...(payload as any),
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
  postponementInstallment: jest.fn(),
  singlePostponementInstallment: jest.fn(),
  getPostponementSimulation: jest.fn(),
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

export const makePrismaInstallmentRepositoryStub =
  (): jest.Mocked<PrismaInstallmentRepository> => {
    const result: jest.Mocked<Partial<PrismaInstallmentRepository>> = {
      findMany: jest.fn().mockResolvedValue(makeFakeBenefitList()),
      findFirst: jest.fn().mockResolvedValue(makeFakeBenefit({})),
      create: jest.fn().mockResolvedValue(makeFakeBenefit({})),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn().mockResolvedValue(11),
    };
    return result as jest.Mocked<PrismaInstallmentRepository>;
  };

export const makePrismaClient = (): {
  prismaClient: jest.Mocked<PrismaClient>;
  prismaBenefitRepository: jest.Mocked<PrismaBenefitRepository>;
  prismaInstallmentRepository: jest.Mocked<PrismaInstallmentRepository>;
} => {
  const prismaBenefitRepository = makePrismaBenefitRepositoryStub();
  const prismaInstallmentRepository = makePrismaInstallmentRepositoryStub();

  const result: jest.Mocked<Partial<PrismaClient>> = {
    benefit: prismaBenefitRepository,
    installment: prismaInstallmentRepository,
  };
  return {
    prismaClient: result as jest.Mocked<PrismaClient>,
    prismaBenefitRepository,
    prismaInstallmentRepository,
  };
};

export const makeBenefitRepositoryStub =
  (): jest.Mocked<IBenefitRepository> => ({
    findAll: jest.fn().mockResolvedValue(makeFakeBenefitList()),
    findById: jest.fn().mockResolvedValue(makeFakeBenefit({})),
    create: jest.fn().mockResolvedValue(makeFakeBenefit({})),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    countEditTimes: jest.fn(),
  });
