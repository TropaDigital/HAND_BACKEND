import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { AuthService } from '../../shared/auth/auth';
import { UserRepository } from '../user/repository';
import { LoginController } from './controller';
import * as schemas from './schemas';
import { LoginService } from './service';

export const createLoginService = (): LoginService => {
  const mySql = MySqlDBClient.getInstance();
  const userRepository = new UserRepository(
    mySql.getPrismaClientInstance().user,
  );
  const authService = new AuthService();
  const result = new LoginService(userRepository, authService);

  return result;
};

export const createValidator = (): JoiAdapter => {
  const result = new JoiAdapter(schemas);

  return result;
};

export const createLoginController = (): LoginController => {
  const loginService = createLoginService();
  const validator = createValidator();
  const result = new LoginController(loginService, validator);

  return result;
};
