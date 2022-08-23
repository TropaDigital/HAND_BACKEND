import { ICreateBenefitParams } from '../../../../src/modules/benefit/interfaces';

export const makeFakeCreateBenefitParams = (
  payload?: Partial<ICreateBenefitParams>,
): ICreateBenefitParams => ({
  associatedId: 1,
  consultantId: 1,
  association: 'ASES',
  bank: 'Any Bank',
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
  payload?: Partial<ICreateBenefitParams>,
): ICreateBenefitParams => ({
  associatedId: 1,
  consultantId: 1,
  association: 'ASES',
  bank: 'Any Bank',
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
      makeFakeBenefit({ associatedId: 1 }),
      makeFakeBenefit({ associatedId: 2 }),
      makeFakeBenefit({ associatedId: 3 }),
    ],
  });
};
