import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { AuthService } from '../../shared/auth/auth';
import { UserController } from './controller';
import { IUserController } from './interfaces';
import { UserRepository } from './repository';
import * as schemas from './schemas';
import { UserService } from './service';

export const createUserController = (): IUserController => {
  const mySql = MySqlDBClient.getInstance();
  const repository = new UserRepository(mySql.getPrismaClientInstance().user);
  const authService = new AuthService();
  const userService = new UserService(repository, authService);
  const joiAdapter = new JoiAdapter(schemas);
  const result = new UserController(userService, joiAdapter);

  return result;
};
