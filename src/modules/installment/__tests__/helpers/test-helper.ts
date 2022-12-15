import { Prisma, PrismaClient } from '@prisma/client';

import { IInstallmentRepository } from '../../interfaces';
import { PrismaInstallmentRepository } from '../../repository';

export const makePrismaInstallmentRepositoryStub =
  (): jest.Mocked<PrismaInstallmentRepository> => {
    const result: jest.Mocked<Partial<PrismaInstallmentRepository>> = {
      findMany: jest.fn().mockResolvedValue(''),
      findFirst: jest.fn().mockResolvedValue(''),
      createMany: jest.fn().mockResolvedValue(''),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn().mockResolvedValue(11),
      create: jest.fn(),
    };
    return result as jest.Mocked<PrismaInstallmentRepository>;
  };

export const makePrismaClient = (): {
  prismaClient: jest.Mocked<PrismaClient>;
  prismaInstallmentRepository: jest.Mocked<PrismaInstallmentRepository>;
} => {
  const prismaInstallmentRepository = makePrismaInstallmentRepositoryStub();

  const result: jest.Mocked<Partial<PrismaClient>> = {
    installment: prismaInstallmentRepository,
    $transaction: jest.fn(),
  };
  return {
    prismaClient: result as jest.Mocked<PrismaClient>,
    prismaInstallmentRepository,
  };
};

export const makeInstallmentRepositoryStub =
  (): jest.Mocked<IInstallmentRepository> => ({
    createMany: jest.fn(),
    findAll: jest.fn(),
    findByBenefitIdAndReference: jest.fn(),
    softUpdate: jest.fn(),
    disable: jest.fn(),
    findInstallmentByBenefitIdAndInstallmentId: jest.fn(),
    findInstallmentByBenefitIdAndInstallmentIdAndStatus: jest.fn(),
    updateInstallmentByBenefitIdAndInstallmentId: jest.fn(),
    getInstallmentsByReferenceDate: jest.fn(),
  });

export const makeFakeCreateInstallmentParams = (
  payload?: Partial<Prisma.InstallmentCreateInput>,
): Prisma.InstallmentCreateInput => ({
  createdBy: 'user',
  reference: 'abril/2022',
  admnistrationFeeValue: 2,
  bankProcessingFees: 10,
  cardFees: 10,
  consultantCommission: 2,
  dueDate: new Date('2022-10-10'),
  referenceDate: new Date('2022-10-10'),
  ...payload,
});
