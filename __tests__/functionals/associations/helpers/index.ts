import { Address, EmploymentRelationship, Prisma } from '@prisma/client';

import {
  ICreateAssociatedInput,
  IAssociated,
} from '../../../../src/modules/associated/interfaces';

export const makeFakeEmploymentRelationshipParams = (
  payload?: Partial<EmploymentRelationship>,
): Prisma.EmploymentRelationshipCreateInput => ({
  occupation: 'any_occupation',
  salary: 'any_salary',
  paymentDay: 5,
  registerNumber: 'any_register_number',
  contractType: 'contract_type',
  publicAgency: 'any_agency',
  finalDate: new Date(),
  isDefault: true,
  ...payload,
});

export const makeFakeAddressesParams = (
  payload?: Partial<Address>,
): Prisma.AddressCreateInput => ({
  addressType: 'any_type',
  postalCode: 'any_postal_code',
  street: 'any_street',
  houseNumber: 'any_number',
  complement: 'any_complements',
  district: 'any_district',
  city: 'any_city',
  state: 'any_state',
  ...payload,
});

export const makeFakeCreateAssociatedParams = (
  payload?: Partial<IAssociated>,
): ICreateAssociatedInput =>
  ({
    name: 'Any name1',
    lastName: 'Any name',
    gender: 'Any gender',
    birthDate: new Date('2022-10-10'),
    maritalStatus: 'Any status',
    nationality: 'Any nationality',
    placeOfBirth: 'Any place',
    taxId: '000.000.000-00',
    registerId: 'Any id',
    emissionState: 'Any state',
    issuingAgency: 'Any agency',
    emissionDate: new Date('2022-10-10'),
    cellPhone: '00000000',
    email: 'any@mail.com',
    createdBy: 'Any User',
    father: 'Any father',
    mother: 'Any mother',
    partner: 'Any partner',
    affiliations: [
      {
        id: payload?.id || 1,
        name: String(payload?.id) || 'ASES',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ],
    addresses: [
      {
        addressType: 'any_type',
        postalCode: 'any_postal_code',
        street: 'any_street',
        houseNumber: 'any_number',
        complement: 'any_complements',
        district: 'any_district',
        city: 'any_city',
        state: 'any_state',
        isDefault: true,
      },
    ],
    bankAccounts: [
      {
        bank: '00 - Any Bank',
        agency: '0000',
        pixKey: 'any_pix_key',
        pixType: 'any_type',
        accountNumber: 'any_account',
        accountType: 'any_type',
        isDefault: true,
      },
    ],
    employmentRelationships: [
      {
        occupation: 'any_occupation',
        salary: 'any_salary',
        paymentDay: 5,
        registerNumber: 'any_register_number',
        contractType: 'contract_type',
        publicAgency: 'any_agency',
        finalDate: new Date(),
        isDefault: true,
      },
    ],

    ...payload,
  } as any);

export const makeFakeAssociated = (
  payload?: Partial<IAssociated>,
): ICreateAssociatedInput =>
  ({
    id: 1,
    name: 'Any name1',
    mother: 'Any mother',
    nationality: 'Any nationality',

    placeOfBirth: 'Any place',
    bankAccounts: [
      {
        bank: '00 - Any Bank',
        agency: '0000',
        pixKey: 'any_pix_key',
        pixType: 'any_type',
        accountNumber: 'any_account',
        accountType: 'any_type',
        isDefault: true,
      },
    ],
    addresses: [
      {
        addressType: 'any_type',
        postalCode: 'any_postal_code',
        street: 'any_street',
        houseNumber: 'any_number',
        complement: 'any_complements',
        district: 'any_district',
        city: 'any_city',
        state: 'any_state',
        isDefault: true,
      },
    ],

    employmentRelationships: [
      {
        occupation: 'any_occupation',
        salary: 'any_salary',
        paymentDay: 5,
        registerNumber: 'any_register_number',
        contractType: 'contract_type',
        publicAgency: 'any_agency',
        finalDate: new Date(),
        isDefault: true,
      },
    ],

    affiliations: [
      {
        id: payload?.id || 0,
        name: 'some affiliation',
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: new Date(),
      },
    ],
    registerId: 'Any id',
    taxId: '000.000.000-00',
    partner: 'Any partner',
    maritalStatus: 'Any status',
    lastName: 'Any name',
    issuingAgency: 'Any agency',
    gender: 'Any gender',
    father: 'Any father',
    emissionState: 'Any state',
    emissionDate: new Date('2022-10-10'),
    email: 'any@mail.com',
    cellPhone: '00000000',
    birthDate: new Date('2022-10-10'),

    createdBy: 'Any User',

    ...payload,
  } as any);

const createAssociated = async (associated: ICreateAssociatedInput) => {
  const {
    addresses,
    employmentRelationships,
    bankAccounts,
    affiliations,
    ...payload
  } = associated;
  await global.prismaClient.associated.create({
    data: {
      ...payload,
      bankAccounts: { createMany: { data: bankAccounts } },
      addresses: { createMany: { data: addresses } },
      employmentRelationships: {
        createMany: { data: employmentRelationships },
      },
      affiliations: {
        create: affiliations,
      },
    },
  });
};

export const populateDatabase = async (): Promise<void> => {
  await global.prismaClient.associated.deleteMany({});
  await global.prismaClient.affiliation.deleteMany({});
  await global.prismaClient.employmentRelationship.deleteMany({});
  await Promise.all([
    createAssociated(
      makeFakeCreateAssociatedParams({ name: 'João', id: 1, taxId: '1' }),
    ),
    createAssociated(
      makeFakeCreateAssociatedParams({ name: 'Pedro', id: 2, taxId: '2' }),
    ),
    createAssociated(
      makeFakeCreateAssociatedParams({ name: 'Paulo', id: 3, taxId: '3' }),
    ),
  ]);
};
