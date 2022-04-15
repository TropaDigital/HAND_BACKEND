import Joi from 'joi';

import { loanConfig } from './consts';
import { ILoanSimulationBasedOnRequestedValueParams } from './interfaces';

export const GetLoanSimulationByRequestedValue =
  Joi.object<ILoanSimulationBasedOnRequestedValueParams>({
    consultantId: Joi.number().min(1),
    joinedTelemedicine: Joi.boolean().default(false),
    salaryReceiptDate: Joi.date(),
    numberOfInstallments: Joi.number()
      .min(1)
      .max(loanConfig.maximumNumberOfInstallments)
      .required(),
    requestedValue: Joi.number().min(100).required(),
    salary: Joi.number().min(100).required(),
  });
