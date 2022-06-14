import { Associated, Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { IApiHttpRequest, IApiHttpResponse } from '../../../../interfaces/http';
import { IValidator } from '../../../../interfaces/validation/IValidator';
import { IAssociatedRepository, IAssociatedService } from '../../interfaces';
import { PrismaAssociatedRepository } from '../../repository';

export const makeFakeCreateAssociatedInput = (
  payload?: Partial<Prisma.AssociatedCreateInput>,
): jest.Mocked<Prisma.AssociatedCreateInput> => ({
  accountNumber: 'any_account',
  accountType: 'any_type',
  addressType: 'any_type',
  affiliation: 'any_affiliation',
  agency: '0000',
  bank: '00 - Any Bank',
  birthDate: new Date(),
  celPhone: '00-0000000',
  city: 'any_city',
  complement: 'any_complements',
  contractType: 'contract_type',
  createdBy: 'any_data',
  district: 'any_district',
  email: 'any@email.com',
  emissionDate: new Date(),
  emissionState: 'any_state',
  father: 'any_father',
  gender: 'any_gender',
  houseNumber: 'any_number',
  issuingAgency: 'any_agency',
  lastName: 'any_last_name',
  maritalStatus: 'any_marital_status',
  mother: 'any_mother',
  name: 'any_name',
  nationality: 'any_nationality',
  occupation: 'any_occupation',
  paymentDay: 5,
  pixKey: 'any_pix_key',
  placeOfBirth: 'any_place',
  postalCode: 'any_postal_code',
  publicAgency: 'any_agency',
  registerId: 'any_register_id',
  registerNumber: 'any_register_number',
  salary: '456',
  state: 'any_state',
  street: 'any_street',
  taxId: '000.000.000-00',
  partner: 'partner',
  finalDate: new Date(),
  ...payload,
});

export const makeFakeUpdateAssociatedInput = (
  payload?: Partial<Omit<Associated, 'id'>>,
): jest.Mocked<Partial<Omit<Associated, 'id'>>> => ({
  accountNumber: 'any_account',
  accountType: 'any_type',
  addressType: 'any_type',
  affiliation: 'any_affiliation',
  agency: '0000',
  bank: '00 - Any Bank',
  birthDate: new Date(),
  celPhone: '00-0000000',
  city: 'any_city',
  complement: 'any_complements',
  contractType: 'contract_type',
  createdBy: 'any_data',
  district: 'any_district',
  email: 'any@email.com',
  emissionDate: new Date(),
  emissionState: 'any_state',
  father: 'any_father',
  gender: 'any_gender',
  houseNumber: 'any_number',
  issuingAgency: 'any_agency',
  lastName: 'any_last_name',
  maritalStatus: 'any_marital_status',
  mother: 'any_mother',
  name: 'any_name',
  nationality: 'any_nationality',
  occupation: 'any_occupation',
  paymentDay: 5,
  pixKey: 'any_pix_key',
  placeOfBirth: 'any_place',
  postalCode: 'any_postal_code',
  publicAgency: 'any_agency',
  registerId: 'any_register_id',
  registerNumber: 'any_register_number',
  salary: '456',
  state: 'any_state',
  street: 'any_street',
  taxId: '000.000.000-00',
  partner: 'partner',
  finalDate: new Date(),
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
  payload: Partial<Associated>,
): jest.Mocked<Associated> => ({
  id: 0,
  accountNumber: 'any_account',
  accountType: 'any_type',
  addressType: 'any_type',
  affiliation: 'any_affiliation',
  agency: '0000',
  bank: '00 - Any Bank',
  birthDate: new Date(),
  celPhone: '00-0000000',
  city: 'any_city',
  complement: 'any_complements',
  contractType: 'contract_type',
  district: 'any_district',
  email: 'any@email.com',
  emissionDate: new Date(),
  emissionState: 'any_state',
  father: 'any_father',
  gender: 'any_gender',
  houseNumber: 'any_number',
  issuingAgency: 'any_agency',
  lastName: 'any_last_name',
  maritalStatus: 'any_marital_status',
  mother: 'any_mother',
  name: 'any_name',
  nationality: 'any_nationality',
  occupation: 'any_occupation',
  paymentDay: 5,
  pixKey: 'any_pix_key',
  placeOfBirth: 'any_place',
  postalCode: 'any_postal_code',
  publicAgency: 'any_agency',
  registerId: 'any_register_id',
  registerNumber: 'any_register_number',
  salary: 'any_salary',
  state: 'any_state',
  street: 'any_street',
  taxId: '000.000.000-00',
  partner: 'partner',
  createdBy: 'any_user',
  finalDate: new Date(),
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
  });
