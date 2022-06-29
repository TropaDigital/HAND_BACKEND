import { Associated, Prisma } from '@prisma/client';

export const makeFakeCreateAssociatedParams = (
  payload?: Partial<Associated>,
): Prisma.AssociatedCreateInput => ({
  name: 'Any name',
  mother: 'Any mother',
  nationality: 'Any nationality',
  occupation: 'Any occupation',
  paymentDay: 5,
  pixKey: 'Any key',
  placeOfBirth: 'Any place',
  postalCode: 'Any code',
  publicAgency: 'Any agency',
  registerId: 'Any id',
  registerNumber: 'Any number',
  salary: '2000',
  state: 'Any state',
  street: 'Any street',
  taxId: '000.000.000-00',
  partner: 'Any partner',
  maritalStatus: 'Any status',
  lastName: 'Any name',
  issuingAgency: 'Any agency',
  houseNumber: 'Any number',
  gender: 'Any gender',
  father: 'Any father',
  emissionState: 'Any state',
  emissionDate: new Date('2022-10-10'),
  email: 'any@mail.com',
  district: 'Any district',
  contractType: 'Any contract',
  complement: 'Any complement',
  city: 'Any city',
  cellPhone: '00000000',
  birthDate: new Date('2022-10-10'),
  bank: 'Any bank',
  agency: '000',
  affiliation: 'Any affiliation',
  addressType: 'Any type',
  accountType: 'Any type',
  accountNumber: '23132',
  createdBy: 'Any User',
  ...payload,
});

export const makeFakeAssociated = (
  payload?: Partial<Associated>,
): Prisma.AssociatedCreateInput => ({
  name: 'Any name',
  mother: 'Any mother',
  nationality: 'Any nationality',
  occupation: 'Any occupation',
  paymentDay: 5,
  pixKey: 'Any key',
  placeOfBirth: 'Any place',
  postalCode: 'Any code',
  publicAgency: 'Any agency',
  registerId: 'Any id',
  registerNumber: 'Any number',
  salary: '2000',
  state: 'Any state',
  street: 'Any street',
  taxId: '000.000.000-00',
  partner: 'Any partner',
  maritalStatus: 'Any status',
  lastName: 'Any name',
  issuingAgency: 'Any agency',
  houseNumber: 'Any number',
  gender: 'Any gender',
  father: 'Any father',
  emissionState: 'Any state',
  emissionDate: new Date('2022-10-10'),
  email: 'any@mail.com',
  district: 'Any district',
  contractType: 'Any contract',
  complement: 'Any complement',
  city: 'Any city',
  cellPhone: '00000000',
  birthDate: new Date('2022-10-10'),
  bank: 'Any bank',
  agency: '000',
  affiliation: 'Any affiliation',
  addressType: 'Any type',
  accountType: 'Any type',
  accountNumber: '23132',
  createdBy: 'Any User',
  ...payload,
});

export const populateDatabase = async (): Promise<void> => {
  await global.prismaClient.associated.createMany({
    data: [
      makeFakeAssociated({ name: 'João', id: 1, taxId: '1' }),
      makeFakeAssociated({ name: 'Pedro', id: 2, taxId: '2' }),
      makeFakeAssociated({ name: 'Mateus', id: 3, taxId: '3' }),
    ],
  });
};