import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { RoleController } from './controller';
import { IRoleController } from './interfaces';
import { RoleRepository } from './repository';
import * as schemas from './schemas';
import { RoleService } from './service';

export const createRoleController = (): IRoleController => {
  const mySql = MySqlDBClient.getInstance();
  const repository = new RoleRepository(mySql.getPrismaClientInstance().role);
  const roleService = new RoleService(repository);
  const joiAdapter = new JoiAdapter(schemas);
  const result = new RoleController(roleService, joiAdapter);

  return result;
};
