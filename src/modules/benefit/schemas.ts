import { BenefitType } from '@prisma/client';
import Joi from 'joi';

import { MonthOfPayment } from '../../enums/MonthOfPayment';
import { loanConfig } from '../loanSimulation/consts';
import { ICreateBenefitParams } from './interfaces';

export const GetBenefitById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});

export const CreateBenefit = Joi.object<ICreateBenefitParams>({
  createdBy: Joi.string().required(),
  type: Joi.string().valid(...Object.keys(BenefitType)),
  affiliationId: Joi.number().required(),
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

export const GetPostponementSimulation = Joi.object<{
  id: number;
  single: boolean;
}>({
  id: Joi.number().min(1).required(),
  single: Joi.boolean().default(false),
});

export const AdjustContractById = Joi.object<{
  id: number;
  single: boolean;
}>({
  id: Joi.number().min(1).required(),
  single: Joi.boolean().default(false),
});

export const DeleteBenefitById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});

export const DimississInstallmentByBenefitIdAndInstallmentId = Joi.object<{
  benefitId: number;
  installmentId: number;
  user: string;
}>({
  benefitId: Joi.number().min(1).required(),
  installmentId: Joi.number().min(1).required(),
  user: Joi.string().required(),
});
