import { Prisma } from '@prisma/client';
import Joi from 'joi';

import { ICreateAssociatedInput, IUpdateAssociatedInput } from './interfaces';

export const GetAssociatedById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});

export const CreateAssociated = Joi.object<ICreateAssociatedInput>({
  name: Joi.string().required().label('nome'),
  lastName: Joi.string().required().label('sobrenome'),
  gender: Joi.string().required().label('sexo'),
  birthDate: Joi.date().required().label('birthDate'),
  maritalStatus: Joi.string().required().label('estado-civil'),
  nationality: Joi.string().required().label('nacionalidade'),
  placeOfBirth: Joi.string().required().label('naturalidade'),
  taxId: Joi.string().min(14).max(14).required().label('cpf'),
  registerId: Joi.string().required().label('rg'),
  emissionState: Joi.string().required().label('estado-emissor'),
  issuingAgency: Joi.string().required().label('orgao-emissor'),
  emissionDate: Joi.date().required().label('data-emissao'),
  cellPhone: Joi.string().required().label('celular'),
  email: Joi.string().email().required().label('email'),
  father: Joi.string().required().label('pai'),
  mother: Joi.string().required().label('mãe'),
  partner: Joi.string().label('cônjuge'),

  affiliations: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
      }),
    )
    .required(),
  addresses: Joi.array()
    .items(
      Joi.object({
        addressType: Joi.string().required().label('tipo de endereço'),
        postalCode: Joi.string().required().label('cep'),
        street: Joi.string().required().label('logradouro'),
        houseNumber: Joi.string().required().label('número'),
        complement: Joi.string().allow('').label('complemento'),
        district: Joi.string().required().label('bairro'),
        city: Joi.string().required().label('cidade'),
        state: Joi.string().required().label('estado'),
      }),
    )
    .required(),

  employmentRelationships: Joi.array()
    .items(
      Joi.object({
        occupation: Joi.string().label('profissão'),
        salary: Joi.string().label('salário'),
        paymentDay: Joi.number().min(1).max(31).label('dia de pagamento'),
        registerNumber: Joi.string().label('matrícula'),
        contractType: Joi.string().label('tipo de contrato'),
        finalDate: Joi.date().label('data final'),
        publicAgency: Joi.string().label('órgão público'),
      }),
    )
    .required(),
  bankAccounts: Joi.array().items(
    Joi.object({
      bank: Joi.string().required().label('banco'),
      agency: Joi.string().required().label('agencia'),
      accountType: Joi.string().required().label('tipo de conta'),
      accountNumber: Joi.string().required().label('número da conta'),
      pixKey: Joi.string().label('chave pix'),
      pixType: Joi.string().label('tipo_pix'),
    }),
  ),
  createdBy: Joi.string().required().label('createdBy'),
});

export const UpdateAssociatedById = Joi.object<
  IUpdateAssociatedInput & { id: number }
>({
  id: Joi.number().min(1).required(),
  name: Joi.string().label('nome'),
  lastName: Joi.string().label('sobrenome'),
  gender: Joi.string().label('sexo'),
  birthDate: Joi.date().label('birthDate'),
  maritalStatus: Joi.string().label('estado-civil'),
  nationality: Joi.string().label('nacionalidade'),
  placeOfBirth: Joi.string().label('naturalidade'),
  taxId: Joi.string().min(14).max(14).label('cpf'),
  registerId: Joi.string().label('rg'),
  emissionState: Joi.string().label('estado-emissor'),
  issuingAgency: Joi.string().label('orgao-emissor'),
  emissionDate: Joi.date().label('data-emissao'),
  cellPhone: Joi.string().label('celular'),
  email: Joi.string().email().label('email'),
  father: Joi.string().label('pai'),
  mother: Joi.string().label('mãe'),
  partner: Joi.string().label('cônjuge'),

  affiliations: Joi.array().items(
    Joi.object({
      id: Joi.number(),
      name: Joi.string(),
    }),
  ),
  addresses: Joi.array().items(
    Joi.object({
      addressType: Joi.string().required().label('tipo de endereço'),
      postalCode: Joi.string().required().label('cep'),
      street: Joi.string().required().label('logradouro'),
      houseNumber: Joi.string().required().label('número'),
      complement: Joi.string().allow('').label('complemento'),
      district: Joi.string().required().label('bairro'),
      city: Joi.string().required().label('cidade'),
      state: Joi.string().required().label('estado'),
    }),
  ),

  employmentRelationships: Joi.array().items(
    Joi.object({
      id: Joi.number(),
      occupation: Joi.string().label('profissão'),
      salary: Joi.string().label('salário'),
      paymentDay: Joi.number().min(1).max(31).label('dia de pagamento'),
      registerNumber: Joi.string().label('matrícula'),
      contractType: Joi.string().label('tipo de contrato'),
      finalDate: Joi.date().label('data final'),
      publicAgency: Joi.string().label('órgão público'),
    }),
  ),

  bankAccounts: Joi.array().items(
    Joi.object({
      bank: Joi.string().label('banco'),
      agency: Joi.string().label('agencia'),
      accountType: Joi.string().label('tipo de conta'),
      accountNumber: Joi.string().label('número da conta'),
      pixKey: Joi.string().label('chave pix'),
      pixType: Joi.string().label('tipo_pix'),
    }),
  ),
  createdBy: Joi.string().label('createdBy'),
});

export const DeleteAssociatedById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});

export const getEmploymentRelationshipsByAssociatedId = Joi.object<{
  id: number;
}>({
  id: Joi.number().min(1).required(),
});

export const getBankAccountsByAssociatedId = Joi.object<{
  id: number;
}>({
  id: Joi.number().min(1).required(),
});

export const getAddressesByAssociatedId = Joi.object<{
  id: number;
}>({
  id: Joi.number().min(1).required(),
});

export const updateEmploymentRelationshipsByAssociatedIdAndId = Joi.object<
  Prisma.EmploymentRelationshipUpdateInput & {
    id?: number;
    associatedId: number;
  }
>({
  isDefault: Joi.boolean().label('principal'),
  associatedId: Joi.number().required(),
  id: Joi.number(),
  occupation: Joi.string().label('profissão'),
  salary: Joi.string().label('salário'),
  paymentDay: Joi.number().min(1).max(31).label('dia de pagamento'),
  registerNumber: Joi.string().label('matrícula'),
  contractType: Joi.string().label('tipo de contrato'),
  finalDate: Joi.date().label('data final'),
  publicAgency: Joi.string().label('órgão público'),
});

export const updateBankAccountByAssociatedIdAndId = Joi.object<
  Prisma.BankAccountUpdateInput & {
    id?: number;
    associatedId: number;
  }
>({
  isDefault: Joi.boolean().label('principal'),
  associatedId: Joi.number().required(),
  id: Joi.number(),
  accountNumber: Joi.string().label('conta'),
  accountType: Joi.string().label('tipo'),
  agency: Joi.string().label('agencia'),
  bank: Joi.string().label('banco'),
  pixKey: Joi.string().label('chave pix'),
  pixType: Joi.string().label('tipo de chave pix'),
});

export const updateAddressByAssociatedIdAndId = Joi.object<
  Prisma.AddressUpdateInput & {
    id?: number;
    associatedId: number;
  }
>({
  isDefault: Joi.boolean().label('principal'),
  id: Joi.number(),
  associatedId: Joi.number().required(),
  addressType: Joi.string().required().label('tipo de endereço'),
  postalCode: Joi.string().required().label('cep'),
  street: Joi.string().required().label('logradouro'),
  houseNumber: Joi.string().required().label('número'),
  complement: Joi.string().allow('').label('complemento'),
  district: Joi.string().required().label('bairro'),
  city: Joi.string().required().label('cidade'),
  state: Joi.string().required().label('estado'),
});
