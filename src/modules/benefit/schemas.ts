import { BenefitType, Prisma } from '@prisma/client';
import Joi from 'joi';

import { MonthOfPayment } from '../../enums/MonthOfPayment';
import { loanConfig } from '../loanSimulation/consts';
import { ICreateBenefitParams } from './interfaces';

export const GetBenefitById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});

export const CreateBenefit = Joi.object<ICreateBenefitParams>({
  type: Joi.string().valid(...Object.keys(BenefitType)),
  affiliation: Joi.string().required(),
  addressId: Joi.number().min(1).required(),
  bankAccountId: Joi.number().min(1).required(),
  employmentRelationshipId: Joi.number().min(1).required(),
  associatedId: Joi.number().min(1).required(),
  consultantId: Joi.number().min(1),
  joinedTelemedicine: Joi.boolean().default(false),
  salaryReceiptDate: Joi.date(),
  numberOfInstallments: Joi.number()
    .min(1)
    .max(loanConfig.maximumNumberOfInstallments)
    .required(),
  requestedValue: Joi.number().min(100).required(),
  salary: Joi.number().min(100).required(),
  monthOfPayment: Joi.string()
    .valid(...Object.values(MonthOfPayment))
    .required(),
  administrationFeeValue: Joi.number().default(0),
  hasGratification: Joi.boolean().default(false),
});

export const UpdateBenefitById = Joi.object<
  Prisma.BenefitUpdateInput & {
    id: number;
    associatedId: number;
    consultantId: number;
  }
>({
  type: Joi.string().valid(...Object.keys(BenefitType)),
  affiliation: Joi.string().required(),
  associatedId: Joi.number().min(1).required(),
  consultantId: Joi.number().min(1),
  id: Joi.number().min(1).required(),
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
