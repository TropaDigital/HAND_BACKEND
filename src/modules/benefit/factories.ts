import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { createAssociatedRepository } from '../associated/factories';
import { IAssociatedRepository } from '../associated/interfaces';
import { ConsultantRepository } from '../consultant/repository';
import { ConsultantService } from '../consultant/service';
import { InstallmentRepository } from '../installment/repository';
import { LoanSimulationService } from '../loanSimulation/service';
import { BenefitController } from './controller';
import { IBenefitController, IBenefitService } from './interfaces';
import { BenefitRepository } from './repository';
import * as schemas from './schemas';
import { BenefitService } from './service';

export const createBenefitService = (
  associatedRepository: IAssociatedRepository,
): IBenefitService => {
  const mySql = MySqlDBClient.getInstance();
  const repository = new BenefitRepository(mySql.getPrismaClientInstance());
  const consultantRepository = new ConsultantRepository(
    mySql.getPrismaClientInstance().consultant,
  );
  const consultantService = new ConsultantService(consultantRepository);
  const loanSimulationService = new LoanSimulationService(consultantService);
  const installmentRepository = new InstallmentRepository(
    mySql.getPrismaClientInstance(),
  );
  return new BenefitService(
    repository,
    associatedRepository,
    loanSimulationService,
    installmentRepository,
    mySql.getPrismaClientInstance(),
  );
};

export const createBenefitController = (): IBenefitController => {
  const joiAdapter = new JoiAdapter(schemas);
  const benefitService = createBenefitService(createAssociatedRepository());
  const result = new BenefitController(benefitService, joiAdapter);

  return result;
};
