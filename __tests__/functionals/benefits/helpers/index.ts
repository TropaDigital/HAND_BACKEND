import { ICreateBenefitParams } from '../../../../src/modules/benefit/interfaces';

export const makeFakeCreateBenefitParams = (
  payload?: Partial<ICreateBenefitParams>,
): ICreateBenefitParams => ({
  ...(payload as any),
});

export const makeFakeBenefit = (
  payload?: Partial<ICreateBenefitParams>,
): ICreateBenefitParams => ({
  ...(payload as any),
});

export const populateDatabase = async (): Promise<void> => {
  await global.prismaClient.benefit.createMany({
    data: [
      makeFakeBenefit({ associatedId: 1 }),
      makeFakeBenefit({ associatedId: 2 }),
      makeFakeBenefit({ associatedId: 3 }),
    ] as any[],
  });
};
