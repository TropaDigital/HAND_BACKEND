import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { ConsultantController } from './controller';
import {
  IConsultantController,
  IConsultantRepository,
  IConsultantService,
} from './interfaces';
import { ConsultantRepository } from './repository';
import * as schemas from './schemas';
import { ConsultantService } from './service';

export const createConsultantRepository = (): IConsultantRepository => {
  const mySql = MySqlDBClient.getInstance();
  return new ConsultantRepository(mySql.getPrismaClientInstance().consultant);
};

export const createConsultantService = (): IConsultantService => {
  const repository = createConsultantRepository();
  return new ConsultantService(repository);
};

export const createConsultantJoiAdapter = (): JoiAdapter<typeof schemas> => {
  return new JoiAdapter(schemas);
};

export const createConsultantController = (): IConsultantController => {
  const joiAdapter = createConsultantJoiAdapter();
  const consultantService = createConsultantService();
  return new ConsultantController(consultantService, joiAdapter);
};
