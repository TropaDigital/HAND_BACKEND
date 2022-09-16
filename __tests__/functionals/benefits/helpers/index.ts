import { Benefit, BenefitStatus, BenefitType } from '@prisma/client';

import { MonthOfPayment } from '../../../../src/enums/MonthOfPayment';
import { ICreateBenefitParams } from '../../../../src/modules/benefit/interfaces';

export const makeFakeCreateBenefitParams = async (
  payload?: Partial<ICreateBenefitParams>,
): Promise<ICreateBenefitParams> => {
  const associated = await global.prismaClient.associated.findFirst({
    where: { id: payload?.associatedId || 1 },
    include: {
      addresses: {
        orderBy: {
          isDefault: 'desc',
        },
      },
      employmentRelationships: {
        orderBy: {
          isDefault: 'desc',
        },
      },
      bankAccounts: {
        orderBy: {
          isDefault: 'desc',
        },
      },
      benefits: true,
      affiliations: true,
    },
  });
  return {
    type: BenefitType.D,
    affiliation: 'any affiliation',
    addressId: associated?.addresses[0].id,
    bankAccountId: associated?.bankAccounts[0].id,
    employmentRelationshipId: associated?.employmentRelationships[0].id,
    associatedId: 1,
    consultantId: 1,
    joinedTelemedicine: true,
    salaryReceiptDate: new Date(),
    numberOfInstallments: 4,
    requestedValue: 1000,
    salary: 1500,
    monthOfPayment: MonthOfPayment.CURRENT_MONTH,
    administrationFeeValue: 0,
    hasGratification: true,
    ...(payload as any),
  };
};

export const makeFakeBenefit = (
  payload: Partial<Benefit>,
): jest.Mocked<Benefit> => ({
  associatedId: 1,
  commission: 0,
  administrationFeeValue: 0,
  hasGratification: false,
  joinedTelemedicine: false,
  bank: 'any bank',
  publicAgency: 'any public agency',
  contractModel: 'any contract model',
  installmentNumber: 2,
  initialDate: new Date(),
  financialAssistanceValue: 0,
  installmentValue: 0,
  name: 'any name',
  lastName: 'any last name',
  gender: 'M',
  birthDate: new Date(),
  maritalStatus: 'single',
  nationality: 'string',
  placeOfBirth: 'string',
  taxId: 'string',
  registerId: 'string',
  emissionState: 'string',
  issuingAgency: 'string',
  emissionDate: new Date(),
  cellPhone: 'string',
  email: 'string',
  father: 'string',
  mother: 'string',
  partner: 'string',
  occupation: 'string',
  salary: 'string',
  paymentDay: 0,
  registerNumber: 'string',
  contractType: 'string',
  finalDate: new Date(),
  agency: 'string',
  accountType: 'string',
  accountNumber: 'string',
  pixKey: null,
  pixType: null,
  addressType: 'string',
  postalCode: 'string',
  street: 'string',
  houseNumber: 'string',
  complement: null,
  district: 'string',
  city: 'string',
  state: 'string',
  consultantId: null,
  type: BenefitType.D,
  status: BenefitStatus.ACTIVE,
  affiliationId: payload?.associatedId || 0,
  createdBy: 'string',
  updatedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  ...(payload as any),
});

export const populateDatabase = async (): Promise<void> => {
  await global.prismaClient.benefit.deleteMany({});
  await global.prismaClient.benefit.createMany({
    data: [
      makeFakeBenefit({ id: 1, associatedId: 1 }),
      makeFakeBenefit({ id: 2, associatedId: 2 }),
      makeFakeBenefit({ id: 3, associatedId: 3 }),
    ] as any[],
  });
};
