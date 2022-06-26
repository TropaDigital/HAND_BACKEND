import { Prisma } from '@prisma/client';
import Joi from 'joi';

export const GetBenefitById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});

export const CreateBenefit = Joi.object<Prisma.BenefitCreateInput>({
  associated: Joi.string().required(),
  association: Joi.string().required(),
  bank: Joi.string().required(),
  publicAgency: Joi.string().required(),
  contractModel: Joi.string().required(),
  installmentNumber: Joi.number().required(),
  initialDate: Joi.date().required(),
  financialAssistanceValue: Joi.number().required(),
  installmentValue: Joi.number().required(),
  consultant: Joi.string().required(),
  createdBy: Joi.string().required(),
});

export const UpdateBenefitById = Joi.object<
  Prisma.BenefitUpdateInput & { id: number }
>({
  id: Joi.number().min(1).required(),
  associated: Joi.string(),
  association: Joi.string(),
  bank: Joi.string(),
  publicAgency: Joi.string(),
  contractModel: Joi.string(),
  installmentNumber: Joi.number(),
  initialDate: Joi.date(),
  financialAssistanceValue: Joi.number(),
  installmentValue: Joi.number(),
  consultant: Joi.string(),
  createdBy: Joi.string(),
});

export const DeleteBenefitById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});
