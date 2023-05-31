import { Prisma, AssociatedStatus, PhoneType } from '@prisma/client';
import Joi from 'joi';
import { IFindAllParams } from 'src/shared/pagination/interfaces';

import { ICreateAssociatedInput, IUpdateAssociatedInput } from './interfaces';

export const GetAssociatedById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});

export const GetAll = Joi.object<
  IFindAllParams &
    Prisma.AssociatedWhereInput & {
      contractNumber?: string;
      telemedicine?: boolean;
      publicAgency?: string;
      csv?: boolean;
    }
>({
  fullName: Joi.string().allow(null, ''),
  code: Joi.string().allow(null, ''),
  page: Joi.number(),
  resultsPerPage: Joi.number(),
  taxId: Joi.string().allow(null, ''),
  contractNumber: Joi.string().allow(null, ''),
  publicAgency: Joi.string().allow(null, ''),
  telemedicine: Joi.boolean(),
  csv: Joi.boolean(),
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
  emissionDate: Joi.date().allow(null, '').label('data-emissao'),
  email: Joi.string().email().allow(null, '').label('email'),
  father: Joi.string().allow(null, '').label('pai'),
  mother: Joi.string().required().label('mãe'),
  partner: Joi.string().allow(null, '').label('cônjuge'),

  affiliations: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
      }),
    )
    .min(1)
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
        isDefault: Joi.boolean().label('principal'),
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
        finalDate: Joi.date().allow(null, '').label('data final').optional(),
        publicAgency: Joi.string().label('órgão público'),
        isDefault: Joi.boolean().label('principal'),
      }),
    )
    .required(),
  bankAccounts: Joi.array()
    .items(
      Joi.object({
        bank: Joi.string().required().label('banco'),
        agency: Joi.string().required().label('agencia'),
        accountType: Joi.string().required().label('tipo de conta'),
        accountNumber: Joi.string().required().label('número da conta'),
        pixKey: Joi.string().label('chave pix'),
        pixType: Joi.string().label('tipo_pix'),
        isDefault: Joi.boolean().label('principal'),
      }),
    )
    .required(),
  phoneNumbers: Joi.array()
    .items(
      Joi.object({
        number: Joi.string().required(),
        type: Joi.string()
          .valid(...Object.values(PhoneType))
          .required(),
        note: Joi.string().optional(),
      }),
    )
    .min(1)
    .required(),
  references: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        relationshipType: Joi.string().required(),
        note: Joi.string().optional(),
      }),
    )
    .required(),
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
  emissionDate: Joi.date().allow(null, '').default(null).label('data-emissao'),
  email: Joi.string().email().allow(null, '').label('email'),
  father: Joi.string().allow(null, '').label('pai'),
  mother: Joi.string().label('mãe'),
  partner: Joi.string().allow(null, '').label('cônjuge'),
  status: Joi.string().valid(...Object.keys(AssociatedStatus)),
  affiliations: Joi.array()
    .items(
      Joi.object({
        id: Joi.number(),
        name: Joi.string(),
      }),
    )
    .min(1)
    .label('afiliações'),
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
  finalDate: Joi.date().allow(null, '').label('data final').optional(),
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
  associatedId: Joi.number(),
  addressType: Joi.string().label('tipo de endereço'),
  postalCode: Joi.string().label('cep'),
  street: Joi.string().label('logradouro'),
  houseNumber: Joi.string().label('número'),
  complement: Joi.string().allow('').label('complemento'),
  district: Joi.string().label('bairro'),
  city: Joi.string().label('cidade'),
  state: Joi.string().label('estado'),
});

export const updatePhoneNumbersByAssociatedId = Joi.object<{
  associatedId: number;
  phoneNumbers: Prisma.PhoneNumberUpdateInput[];
}>({
  associatedId: Joi.number().required().min(1),
  phoneNumbers: Joi.array().items({
    number: Joi.string().required(),
    type: Joi.string().valid(...Object.values(PhoneType)),
    note: Joi.string(),
  }),
});

export const updateReferencesByAssociatedId = Joi.object<{
  associatedId: number;
  references: Prisma.ReferenceUpdateInput[];
}>({
  associatedId: Joi.number().required().min(1),
  references: Joi.array().items({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    relationshipType: Joi.string().required(),
    note: Joi.string(),
  }),
});
