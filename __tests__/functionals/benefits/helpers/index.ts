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
    affiliationId: 1,
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
  hasGratification: true,
  joinedTelemedicine: true,
  bank: '00 - Any Bank',
  publicAgency: 'any_agency',
  contractModel: '',
  installmentNumber: 4,
  initialDate: new Date(),
  financialAssistanceValue: 1474,
  installmentValue: 368.5,
  name: 'any name',
  lastName: 'any last name',
  gender: 'Any gender',
  birthDate: new Date(),
  maritalStatus: 'Any status',
  nationality: 'Any nationality',
  placeOfBirth: 'Any place',
  taxId: '1',
  registerId: 'Any id',
  emissionState: 'Any state',
  issuingAgency: 'Any agency',
  emissionDate: new Date(),
  cellPhone: '00000000',
  email: 'any@mail.com',
  father: 'Any father',
  mother: 'Any mother',
  partner: 'Any partner',
  occupation: 'any_occupation',
  salary: 'any_salary',
  paymentDay: 5,
  registerNumber: 'any_register_number',
  contractType: 'string',
  finalDate: null,
  agency: '0000',
  accountType: 'any_type',
  accountNumber: 'any_account',
  pixKey: 'any_pix_key',
  pixType: 'any_type',
  addressType: 'any_type',
  postalCode: 'any_postal_code',
  street: 'any_street',
  houseNumber: 'any_number',
  complement: 'any_complements',
  district: 'any_district',
  city: 'any_city',
  state: 'any_state',
  consultantId: null,
  type: BenefitType.D,
  status: BenefitStatus.UNDER_ANALYSIS,
  affiliationId: payload?.associatedId || 0,
  createdBy: 'Any User',
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
