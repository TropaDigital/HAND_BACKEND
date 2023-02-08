import {
  Address,
  Associated,
  BankAccount,
  EmploymentRelationship,
} from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { IApiHttpRequest, IApiHttpResponse } from '../../../../interfaces/http';
import { IValidator } from '../../../../interfaces/validation/IValidator';
import { generateInsertCode } from '../../../../shared/code';
import { makeFakeBenefit } from '../../../benefit/__tests__/helpers/test-helper';
import {
  IAssociated,
  IAssociatedRepository,
  IAssociatedService,
  ICreateAssociatedInput,
  IUpdateAssociatedInput,
} from '../../interfaces';
import {
  PrismaAddressRepository,
  PrismaAssociatedRepository,
  PrismaBankAccountRepository,
  PrismaEmploymentRelationshipRepository,
} from '../../repository';

export const makeFakeCreateAssociatedInput = (
  payload?: Partial<ICreateAssociatedInput>,
): jest.Mocked<ICreateAssociatedInput> =>
  ({
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
    bankAccounts: [
      {
        accountNumber: 'any_account',
        accountType: 'any_type',
        agency: '0000',
        bank: '00 - Any Bank',
        pixKey: 'any_pix_key',
        pixType: 'any_type',
        isDefault: true,
      },
    ],
    affiliations: [
      {
        id: 1,
        name: 'USER',
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: new Date(),
      },
    ],

    birthDate: new Date(),
    cellPhone: '00-0000000',
    createdBy: 'any_data',
    email: 'any@email.com',
    emissionDate: new Date(),
    emissionState: 'any_state',
    father: 'any_father',
    gender: 'any_gender',
    issuingAgency: 'any_agency',
    lastName: 'any_last_name',
    maritalStatus: 'any_marital_status',
    mother: 'any_mother',
    name: 'any_name',
    nationality: 'any_nationality',

    placeOfBirth: 'any_place',
    registerId: 'any_register_id',
    taxId: '000.000.000-00',
    partner: 'partner',
    ...payload,
  } as ICreateAssociatedInput);

export const makeFakeUpdateAssociatedInput = (
  payload?: Partial<IUpdateAssociatedInput>,
): jest.Mocked<IUpdateAssociatedInput> => ({
  affiliations: [
    {
      createdAt: new Date('2022-04-15T00:00:00.000Z'),
      deletedAt: null,
      id: 1,
      name: 'USER',
      updatedAt: new Date('2022-04-15T00:00:00.000Z'),
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
  bankAccounts: [
    {
      accountNumber: 'any_account',
      accountType: 'any_type',
      agency: '0000',
      bank: '00 - Any Bank',
      pixKey: 'any_pix_key',
      pixType: 'any_type',
      isDefault: true,
    },
  ],

  birthDate: new Date(),
  createdBy: 'any_data',
  email: 'any@email.com',
  emissionDate: new Date(),
  emissionState: 'any_state',
  father: 'any_father',
  gender: 'any_gender',
  issuingAgency: 'any_agency',
  lastName: 'any_last_name',
  maritalStatus: 'any_marital_status',
  mother: 'any_mother',
  name: 'any_name',
  nationality: 'any_nationality',

  placeOfBirth: 'any_place',
  registerId: 'any_register_id',
  taxId: '000.000.000-00',
  partner: 'partner',
  ...payload,
});

export const makeFakeApiHttpRequest = ({
  body,
  params,
  headers,
  query,
}: {
  body?: unknown;
  params?: { [key: string]: unknown };
  headers?: { [key: string]: string | string[] | undefined };
  query?: { [key: string]: string | string[] | undefined };
}): jest.Mocked<IApiHttpRequest> => ({ body, params, headers, query });

export const makeFakeApiHttpResponse = (
  status: keyof typeof StatusCodes,
  body?: unknown,
): jest.Mocked<IApiHttpResponse> => ({
  body,
  statusCodeAsString: status || 'OK',
});

export const makeFakeAssociated = (
  payload?: Partial<Omit<IAssociated, 'phoneNumbers' | 'references'>>,
): jest.Mocked<Omit<IAssociated, 'phoneNumbers' | 'references'>> =>
  ({
    id: 0,
    code: generateInsertCode(),
    affiliations: [
      {
        id: 1,
        name: 'USER',
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: new Date(),
      },
    ],
    addresses: [
      {
        id: 2,
        addressType: 'any_type',
        postalCode: 'any_postal_code',
        street: 'any_street',
        houseNumber: 'any_number',
        complement: 'any_complements',
        district: 'any_district',
        city: 'any_city',
        state: 'any_state',
        associatedId: 777,
        isDefault: true,
      },
    ],

    employmentRelationships: [
      {
        id: 2,
        occupation: 'any_occupation',
        salary: 'any_salary',
        paymentDay: 5,
        registerNumber: 'any_register_number',
        contractType: 'contract_type',
        publicAgency: 'any_agency',
        finalDate: new Date(),
        associatedId: 777,
        isDefault: true,
      },
    ],

    birthDate: new Date(),
    cellPhone: '00-0000000',
    email: 'any@email.com',
    emissionDate: new Date(),
    emissionState: 'any_state',
    father: 'any_father',
    gender: 'any_gender',
    issuingAgency: 'any_agency',
    lastName: 'any_last_name',
    maritalStatus: 'any_marital_status',
    mother: 'any_mother',
    name: 'any_name',
    nationality: 'any_nationality',
    benefits: [makeFakeBenefit()],
    bankAccounts: [
      {
        bank: '00 - Any Bank',
        agency: '0000',
        pixKey: 'any_pix_key',
        pixType: 'any_type',
        accountNumber: 'any_account',
        accountType: 'any_type',
        id: 1,
        associatedId: 1,
        isDefault: true,
      },
    ],

    placeOfBirth: 'any_place',
    registerId: 'any_register_id',
    taxId: '000.000.000-00',
    partner: 'partner',
    createdBy: 'any_user',
    updatedBy: 'any',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...payload,
  } as unknown as any);

export const makeFakeAssociatedList = (): Associated[] => [
  makeFakeAssociated({}),
  makeFakeAssociated({}),
];

export const makeValidatorStub = (): jest.Mocked<IValidator> => ({
  validateSchema: jest.fn().mockReturnValue({ id: 777 }),
});

export const makePrismaAssociatedRepositoryStub =
  (): jest.Mocked<PrismaAssociatedRepository> => {
    const result: jest.Mocked<Partial<PrismaAssociatedRepository>> = {
      findMany: jest.fn().mockResolvedValue(makeFakeAssociatedList()),
      findFirst: jest.fn().mockResolvedValue(makeFakeAssociated({})),
      create: jest.fn().mockResolvedValue(makeFakeAssociated({})),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn().mockResolvedValue(10),
    };
    return result as jest.Mocked<PrismaAssociatedRepository>;
  };

export const makeFakeBankAccount = (): BankAccount => ({
  accountNumber: 'some account number',
  accountType: 'some type',
  agency: 'some agency',
  associatedId: 1,
  bank: 'some bank',
  id: 2,
  isDefault: false,
  pixKey: 'some pix',
  pixType: 'CNPJ',
});

export const makeFakeEmploymentRelationship = (): EmploymentRelationship => ({
  associatedId: 1,
  contractType: 'test',
  finalDate: new Date('2022-10-10'),
  id: 1,
  isDefault: true,
  occupation: 'some occupation',
  paymentDay: 1,
  publicAgency: 'some agency',
  registerNumber: 'some register number',
  salary: '3000',
});

export const makeFakeAddress = (): Address => ({
  addressType: 'any_type',
  postalCode: 'any_postal_code',
  street: 'any_street',
  houseNumber: 'any_number',
  complement: 'any_complements',
  district: 'any_district',
  city: 'any_city',
  state: 'any_state',
  isDefault: true,
  associatedId: 1,
  id: 1,
});

export const makeAssociatedRepositoryStub =
  (): jest.Mocked<IAssociatedRepository> => ({
    findAll: jest.fn().mockResolvedValue({ data: makeFakeAssociatedList() }),
    findById: jest.fn().mockResolvedValue(makeFakeAssociated({})),
    create: jest.fn().mockResolvedValue(makeFakeAssociated({})),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    getEmploymentRelationshipsByAssociatedId: jest
      .fn()
      .mockResolvedValue([makeFakeEmploymentRelationship()]),
    upsertEmploymentRelationshipById: jest.fn(),
    getAddressesByAssociatedId: jest
      .fn()
      .mockResolvedValue([makeFakeAddress()]),
    upsertAddressById: jest.fn(),
    getBankAccountsByAssociatedId: jest
      .fn()
      .mockResolvedValue([makeFakeBankAccount()]),
    upsertBankAccountById: jest.fn(),
    deletePhoneNumbersByAssociatedId: jest.fn(),
    deleteReferencesByAssociatedId: jest.fn(),
    upsertPhoneNumberByAssociatedId: jest.fn(),
    upsertReferenceByAssociatedId: jest.fn(),
  });

export const makeFakeBankAccountRepository =
  (): jest.Mocked<PrismaBankAccountRepository> => {
    const result: jest.Mocked<Partial<PrismaBankAccountRepository>> = {
      findMany: jest.fn().mockResolvedValue(makeFakeBankAccount()),
      findFirst: jest.fn(),
      create: jest.fn().mockResolvedValue(makeFakeBankAccount()),
      update: jest.fn().mockResolvedValue(makeFakeBankAccount()),
    };

    return result as jest.Mocked<PrismaBankAccountRepository>;
  };

export const makeFakeEmploymentRelationshipRepository =
  (): jest.Mocked<PrismaEmploymentRelationshipRepository> => {
    const result: jest.Mocked<Partial<PrismaEmploymentRelationshipRepository>> =
      {
        findMany: jest.fn().mockResolvedValue(makeFakeEmploymentRelationship()),
        findFirst: jest.fn(),
        create: jest.fn().mockResolvedValue(makeFakeEmploymentRelationship()),
        update: jest.fn().mockResolvedValue(makeFakeEmploymentRelationship()),
      };

    return result as jest.Mocked<PrismaEmploymentRelationshipRepository>;
  };

export const makeFakeAddressRepository =
  (): jest.Mocked<PrismaAddressRepository> => {
    const result: jest.Mocked<Partial<PrismaAddressRepository>> = {
      findMany: jest.fn().mockResolvedValue(makeFakeAddress()),
      findFirst: jest.fn(),
      create: jest.fn().mockResolvedValue(makeFakeAddress()),
      update: jest.fn().mockResolvedValue(makeFakeAddress()),
    };

    return result as jest.Mocked<PrismaAddressRepository>;
  };

export const makeAssociatedServiceStub =
  (): jest.Mocked<IAssociatedService> => ({
    getAll: jest.fn().mockResolvedValue({ data: makeFakeAssociatedList() }),
    getById: jest.fn().mockResolvedValue(makeFakeAssociated({})),
    create: jest.fn().mockResolvedValue(makeFakeAssociated({})),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    getEmploymentRelationshipsByAssociatedId: jest
      .fn()
      .mockResolvedValue(makeFakeEmploymentRelationship()),
    upsertEmploymentRelationshipById: jest
      .fn()
      .mockResolvedValue(makeFakeEmploymentRelationship()),
    getAddressesByAssociatedId: jest.fn().mockResolvedValue(makeFakeAddress()),
    upsertAddressById: jest.fn().mockResolvedValue(makeFakeAddress()),
    getBankAccountByAssociatedId: jest
      .fn()
      .mockResolvedValue(makeFakeBankAccount()),
    upsertBankAccountById: jest.fn().mockResolvedValue(makeFakeBankAccount()),
    upsertPhoneNumbersByAssociatedId: jest.fn(),
    upsertReferencesByAssociatedId: jest.fn(),
  });
