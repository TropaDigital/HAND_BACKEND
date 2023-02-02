import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { createBenefitService } from '../benefit/factories';
import { AssociatedController } from './controller';
import { IAssociatedController, IAssociatedRepository } from './interfaces';
import { AssociatedRepository } from './repository';
import * as schemas from './schemas';
import { AssociatedService } from './service';

export const createAssociatedRepository = (): IAssociatedRepository => {
  const mySql = MySqlDBClient.getInstance();
  return new AssociatedRepository(mySql.getPrismaClientInstance().associated);
};

export const createAssociatedController = (): IAssociatedController => {
  const repository = createAssociatedRepository();
  const benefitService = createBenefitService(repository);
  const associatedService = new AssociatedService(repository, benefitService);
  const joiAdapter = new JoiAdapter(schemas);
  const result = new AssociatedController(associatedService, joiAdapter);

  return result;
};
