import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { AssociatedController } from './controller';
import { IAssociatedController } from './interfaces';
import { AssociatedRepository } from './repository';
import * as schemas from './schemas';
import { AssociatedService } from './service';

export const createAssociatedController = (): IAssociatedController => {
  const mySql = MySqlDBClient.getInstance();
  const repository = new AssociatedRepository(
    mySql.getPrismaClientInstance().associated,
  );
  const associatedService = new AssociatedService(repository);
  const joiAdapter = new JoiAdapter(schemas);
  const result = new AssociatedController(associatedService, joiAdapter);

  return result;
};
