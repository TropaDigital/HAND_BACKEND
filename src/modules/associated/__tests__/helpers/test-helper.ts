import { StatusCodes } from 'http-status-codes';

import { IApiHttpRequest, IApiHttpResponse } from '../../../../interfaces/http';
import { IValidator } from '../../../../interfaces/validation/IValidator';
import {
  IAssociated,
  IAssociatedRepository,
  IAssociatedService,
  ICreateAssociatedInput,
  IUpdateAssociatedInput,
} from '../../interfaces';
import { PrismaAssociatedRepository } from '../../repository';

export const makeFakeCreateAssociatedInput = (
  payload?: Partial<ICreateAssociatedInput>,
): jest.Mocked<ICreateAssociatedInput> => ({
  accountNumber: 'any_account',
  accountType: 'any_type',
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
  affiliation: 'any_affiliation',
  agency: '0000',
  bank: '00 - Any Bank',
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
  pixKey: 'any_pix_key',
  placeOfBirth: 'any_place',
  registerId: 'any_register_id',
  taxId: '000.000.000-00',
  partner: 'partner',
  ...payload,
});

export const makeFakeUpdateAssociatedInput = (
  payload?: Partial<IUpdateAssociatedInput>,
): jest.Mocked<IUpdateAssociatedInput> => ({
  accountNumber: 'any_account',
  accountType: 'any_type',
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

  affiliation: 'any_affiliation',
  agency: '0000',
  bank: '00 - Any Bank',
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
  pixKey: 'any_pix_key',
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
  params?: { [key: string]: any };
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
  payload: Partial<IAssociated>,
): jest.Mocked<IAssociated> => ({
  id: 0,
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
      associatedId: 0,
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
      associatedId: 0,
    },
  ],

  affiliation: 'any_affiliation',
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

  bank: '00 - Any Bank',
  agency: '0000',
  pixKey: 'any_pix_key',
  pixType: 'any_type',
  accountNumber: 'any_account',
  accountType: 'any_type',

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
});

export const makeFakeAssociatedList = () => [
  makeFakeAssociated({}),
  makeFakeAssociated({}),
];

export const makeAssociatedServiceStub =
  (): jest.Mocked<IAssociatedService> => ({
    getAll: jest.fn().mockResolvedValue(makeFakeAssociatedList()),
    getById: jest.fn().mockResolvedValue(makeFakeAssociated({})),
    create: jest.fn().mockResolvedValue(makeFakeAssociated({})),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    getEmploymentRelationshipsByAssociatedId: jest.fn(),
    upsertEmploymentRelationshipById: jest.fn(),
    getAddressesByAssociatedId: jest.fn(),
    upsertAddressById: jest.fn(),
  });

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

export const makeAssociatedRepositoryStub =
  (): jest.Mocked<IAssociatedRepository> => ({
    findAll: jest.fn().mockResolvedValue(makeFakeAssociatedList()),
    findById: jest.fn().mockResolvedValue(makeFakeAssociated({})),
    create: jest.fn().mockResolvedValue(makeFakeAssociated({})),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    getEmploymentRelationshipsByAssociatedId: jest.fn(),
    upsertEmploymentRelationshipById: jest.fn(),
    getAddressesByAssociatedId: jest.fn(),
    upsertAddressById: jest.fn(),
  });
