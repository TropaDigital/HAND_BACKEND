import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { AffiliationController } from './controller';
import { IAffiliationController } from './interfaces';
import { AffiliationRepository } from './repository';
import * as schemas from './schemas';
import { AffiliationService } from './service';

export const createAffiliationController = (): IAffiliationController => {
  const mySql = MySqlDBClient.getInstance();
  const repository = new AffiliationRepository(
    mySql.getPrismaClientInstance().affiliation,
  );
  const affiliationService = new AffiliationService(repository);
  const joiAdapter = new JoiAdapter(schemas);
  const result = new AffiliationController(affiliationService, joiAdapter);

  return result;
};
