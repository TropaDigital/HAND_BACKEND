import { Benefit, Prisma } from '@prisma/client';

export const makeFakeCreateBenefitParams = (
  payload?: Partial<Benefit>,
): Prisma.BenefitCreateInput => ({
  associated: 'Name',
  association: 'ASES',
  bank: 'Any Bank',
  consultant: 'Any Consultant',
  contractModel: 'Any model',
  financialAssistanceValue: 20,
  installmentNumber: 6,
  installmentValue: 20,
  publicAgency: 'Public Agency',
  initialDate: new Date('2022-10-10'),
  createdBy: 'User',
  ...payload,
});

export const makeFakeBenefit = (
  payload?: Partial<Benefit>,
): Prisma.BenefitCreateInput => ({
  associated: 'Name',
  association: 'ASES',
  bank: 'Any Bank',
  consultant: 'Any Consultant',
  contractModel: 'Any model',
  financialAssistanceValue: 20,
  installmentNumber: 6,
  installmentValue: 20,
  publicAgency: 'Public Agency',
  initialDate: new Date('2022-10-10'),
  createdBy: 'User',
  ...payload,
});

export const populateDatabase = async (): Promise<void> => {
  await global.prismaClient.benefit.createMany({
    data: [
      makeFakeBenefit({ associated: 'João', id: 1 }),
      makeFakeBenefit({ associated: 'Pedro', id: 2 }),
      makeFakeBenefit({ associated: 'Mateus', id: 3 }),
    ],
  });
};
