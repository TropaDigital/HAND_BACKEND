import JoiAdapter from '../../adapters/joi/JoiAdapter';
import { createConsultantService } from '../consultant/factories';
import { LoanSimulationController } from './controller';
import {
  ILoanSimulationController,
  ILoanSimulationService,
} from './interfaces';
import * as schemas from './schemas';
import { LoanSimulationService } from './service';

export const createLoanSimulationJoiAdapter = (): JoiAdapter<
  typeof schemas
> => {
  return new JoiAdapter(schemas);
};

export const createLoanSimulationService = (): ILoanSimulationService => {
  const consultantService = createConsultantService();
  return new LoanSimulationService(consultantService);
};

export const createLoanSimulationController = (): ILoanSimulationController => {
  const loanSimulationService = createLoanSimulationService();
  const joiAdapter = createLoanSimulationJoiAdapter();
  return new LoanSimulationController(loanSimulationService, joiAdapter);
};
