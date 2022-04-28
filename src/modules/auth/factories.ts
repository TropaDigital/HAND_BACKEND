import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { AuthenticationService } from '../../shared/auth/auth';
import { UserRepository } from '../user/repository';
import { AuthController } from './controller';
import * as schemas from './schemas';
import { AuthService } from './service';

export const createLoginService = (): AuthService => {
  const mySql = MySqlDBClient.getInstance();
  const userRepository = new UserRepository(
    mySql.getPrismaClientInstance().user,
  );
  const authService = new AuthenticationService();
  const result = new AuthService(userRepository, authService);

  return result;
};

export const createValidator = (): JoiAdapter => {
  const result = new JoiAdapter(schemas);

  return result;
};

export const createLoginController = (): AuthController => {
  const loginService = createLoginService();
  const validator = createValidator();
  const result = new AuthController(loginService, validator);

  return result;
};
