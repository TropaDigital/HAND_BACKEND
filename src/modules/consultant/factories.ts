import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { ConsultantController } from './controller';
import { ConsultantRepository } from './repository';
import * as schemas from './schemas';
import { ConsultantService } from './service';

export const createConsultantController = (): ConsultantController => {
  const mySql = MySqlDBClient.getInstance();
  const repository = new ConsultantRepository(
    mySql.getPrismaClientInstance().consultant,
  );
  const consultantService = new ConsultantService(repository);
  const joiAdapter = new JoiAdapter(schemas);
  const result = new ConsultantController(consultantService, joiAdapter);

  return result;
};
