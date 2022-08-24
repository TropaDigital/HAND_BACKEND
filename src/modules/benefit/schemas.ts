import { BenefitType, Prisma } from '@prisma/client';
import Joi from 'joi';

import { ICreateBenefitParams } from './interfaces';

export const GetBenefitById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});

export const CreateBenefit = Joi.object<ICreateBenefitParams>({
  type: Joi.string().valid(BenefitType.D, BenefitType.J, BenefitType.N),
  associatedId: Joi.number().min(1).required(),
  consultantId: Joi.number().min(1),
  association: Joi.string().required(),
  bank: Joi.string().required(),
  publicAgency: Joi.string().required(),
  contractModel: Joi.string().required(),
  installmentNumber: Joi.number().required(),
  initialDate: Joi.date().required(),
  financialAssistanceValue: Joi.number().required(),
  installmentValue: Joi.number().required(),
  createdBy: Joi.string().required(),
});

export const UpdateBenefitById = Joi.object<
  Prisma.BenefitUpdateInput & {
    id: number;
    associatedId: number;
    consultantId: number;
  }
>({
  type: Joi.string().valid(...Object.keys(BenefitType)),
  associatedId: Joi.number().min(1).required(),
  consultantId: Joi.number().min(1),
  id: Joi.number().min(1).required(),
  association: Joi.string(),
  bank: Joi.string(),
  publicAgency: Joi.string(),
  contractModel: Joi.string(),
  installmentNumber: Joi.number(),
  initialDate: Joi.date(),
  financialAssistanceValue: Joi.number(),
  installmentValue: Joi.number(),
  createdBy: Joi.string(),
});

export const DeleteBenefitById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});
