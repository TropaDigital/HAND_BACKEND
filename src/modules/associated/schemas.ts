import { Prisma } from '@prisma/client';
import Joi from 'joi';

export const GetAssociatedById = Joi.object<{ id: number }>({
  id: Joi.number().required(),
});

export const CreateAssociated = Joi.object<Prisma.AssociatedCreateInput>({
  name: Joi.string().required().label('nome'),
  lastName: Joi.string().required().label('sobrenome'),
  affiliation: Joi.string().required().label('afiliação'),
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

  occupation: Joi.string().required().label('profissão'),
  salary: Joi.string().required().label('salário'),
  paymentDay: Joi.number().min(1).max(31).required().label('dia de pagamento'),
  registerNumber: Joi.string().required().label('matrícula'),
  contractType: Joi.string().required().label('tipo de contrato'),
  finalDate: Joi.date().label('data final'),
  publicAgency: Joi.string().required().label('órgão público'),

  addressType: Joi.string().required().label('tipo de endereço'),
  postalCode: Joi.string().required().label('cep'),
  street: Joi.string().required().label('logradouro'),
  houseNumber: Joi.string().required().label('número'),
  complement: Joi.string().allow('').label('complemento'),
  district: Joi.string().required().label('bairro'),
  city: Joi.string().required().label('cidade'),
  state: Joi.string().required().label('estado'),
  bank: Joi.string().required().label('banco'),
  agency: Joi.string().required().label('agencia'),
  accountType: Joi.string().required().label('tipo de conta'),
  accountNumber: Joi.string().required().label('número da conta'),
  pixKey: Joi.string().required().label('chave pix'),
  createdBy: Joi.string().required().label('createdBy'),
});

export const UpdateAssociatedById = Joi.object<
  Prisma.AssociatedUpdateInput & { id: number }
>({
  id: Joi.number(),
  name: Joi.string().label('nome'),
  lastName: Joi.string().label('sobrenome'),
  affiliation: Joi.string().label('afiliação'),
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

  occupation: Joi.string().label('profissão'),
  salary: Joi.string().label('salário'),
  paymentDay: Joi.number().min(1).max(31).label('dia de pagamento'),
  registerNumber: Joi.string().label('matrícula'),
  contractType: Joi.string().label('tipo de contrato'),
  finalDate: Joi.date().label('data final'),
  publicAgency: Joi.string().label('órgão público'),

  addressType: Joi.string().label('tipo de endereço'),
  postalCode: Joi.string().label('cep'),
  street: Joi.string().label('logradouro'),
  houseNumber: Joi.string().label('número'),
  complement: Joi.string().default('').label('complemento'),
  district: Joi.string().label('bairro'),
  city: Joi.string().label('cidade'),
  state: Joi.string().label('estado'),

  bank: Joi.string().label('banco'),
  agency: Joi.string().label('agencia'),
  accountType: Joi.string().label('tipo de conta'),
  accountNumber: Joi.string().label('número da conta'),
  pixKey: Joi.string().label('chave pix'),

  createdBy: Joi.string().label('created by'),
});

export const DeleteAssociatedById = Joi.object<{ id: number }>({
  id: Joi.number().required(),
});
