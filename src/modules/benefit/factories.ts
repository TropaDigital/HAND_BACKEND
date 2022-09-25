import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { AssociatedRepository } from '../associated/repository';
import { ConsultantRepository } from '../consultant/repository';
import { ConsultantService } from '../consultant/service';
import { LoanSimulationService } from '../loanSimulation/service';
import { BenefitController } from './controller';
import { IBenefitController } from './interfaces';
import { BenefitRepository } from './repository';
import * as schemas from './schemas';
import { BenefitService } from './service';

export const createBenefitController = (): IBenefitController => {
  const mySql = MySqlDBClient.getInstance();
  const repository = new BenefitRepository(mySql.getPrismaClientInstance());
  const associatedRepository = new AssociatedRepository(
    mySql.getPrismaClientInstance().associated,
  );
  const consultantRepository = new ConsultantRepository(
    mySql.getPrismaClientInstance().consultant,
  );
  const consultantService = new ConsultantService(consultantRepository);
  const loanSimulationService = new LoanSimulationService(consultantService);
  const benefitService = new BenefitService(
    repository,
    associatedRepository,
    loanSimulationService,
  );
  const joiAdapter = new JoiAdapter(schemas);
  const result = new BenefitController(benefitService, joiAdapter);

  return result;
};
