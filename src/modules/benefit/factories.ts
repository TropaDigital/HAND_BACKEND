import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { BenefitController } from './controller';
import { IBenefitController } from './interfaces';
import { BenefitRepository } from './repository';
import * as schemas from './schemas';
import { BenefitService } from './service';

export const createBenefitController = (): IBenefitController => {
  const mySql = MySqlDBClient.getInstance();
  const repository = new BenefitRepository(
    mySql.getPrismaClientInstance().benefit,
  );
  const benefitService = new BenefitService(repository);
  const joiAdapter = new JoiAdapter(schemas);
  const result = new BenefitController(benefitService, joiAdapter);

  return result;
};
