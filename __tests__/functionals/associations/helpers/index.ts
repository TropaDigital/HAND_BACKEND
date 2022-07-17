import {
  ICreateAssociatedInput,
  IAssociated,
} from '../../../../src/modules/associated/interfaces';

export const makeFakeCreateAssociatedParams = (
  payload?: Partial<IAssociated>,
): ICreateAssociatedInput => ({
  name: 'Any name1',
  mother: 'Any mother',
  nationality: 'Any nationality',
  pixKey: 'Any key',
  placeOfBirth: 'Any place',

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
  bank: 'Any bank',
  agency: '000',
  affiliation: 'Any affiliation',
  accountType: 'Any type',
  accountNumber: '23132',
  createdBy: 'Any User',
  ...payload,
});

export const makeFakeAssociated = (
  payload?: Partial<IAssociated>,
): ICreateAssociatedInput => ({
  id: 1,
  name: 'Any name1',
  mother: 'Any mother',
  nationality: 'Any nationality',

  pixKey: 'Any key',
  placeOfBirth: 'Any place',

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
  bank: 'Any bank',
  agency: '000',
  affiliation: 'Any affiliation',
  accountType: 'Any type',
  accountNumber: '23132',
  createdBy: 'Any User',

  ...payload,
});

const createAssociated = async (associated: ICreateAssociatedInput) => {
  const { addresses, employmentRelationships, ...payload } = associated;
  await global.prismaClient.associated.create({
    data: {
      ...payload,
      addresses: { createMany: { data: addresses } },
      employmentRelationships: {
        createMany: { data: employmentRelationships },
      },
    },
  });
};

export const populateDatabase = async (): Promise<void> => {
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
