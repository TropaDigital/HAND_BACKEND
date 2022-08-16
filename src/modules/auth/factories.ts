import JoiAdapter from '../../adapters/joi/JoiAdapter';
import MySqlDBClient from '../../infra/mySql';
import { AuthenticationService } from '../../shared/auth/auth';
import { IAuthenticationService } from '../../shared/auth/interfaces';
import { MailerService } from '../../shared/mailer';
import { IUserRepository, IUserService } from '../user/interfaces';
import { UserRepository } from '../user/repository';
import { UserService } from '../user/service';
import { AuthController } from './controller';
import * as schemas from './schemas';
import { AuthService } from './service';

export const createUserRepository = (): IUserRepository => {
  const mySql = MySqlDBClient.getInstance();
  const result = new UserRepository(mySql.getPrismaClientInstance().user);
  return result;
};

export const createAuthService = (): AuthService => {
  const userRepository = createUserRepository();
  const authService = new AuthenticationService();
  const result = new AuthService(userRepository, authService);

  return result;
};

export const createValidator = (): JoiAdapter => {
  const result = new JoiAdapter(schemas);

  return result;
};

export const createAuthenticationService = (): IAuthenticationService => {
  const result = new AuthenticationService();

  return result;
};

export const createUserService = (): IUserService => {
  const repository = createUserRepository();
  const authService = createAuthenticationService();
  const mailerService = new MailerService();
  const result = new UserService(repository, authService, mailerService);
  return result;
};

export const createAuthController = (): AuthController => {
  const authService = createAuthService();
  const validator = createValidator();
  const userService = createUserService();
  const result = new AuthController(authService, userService, validator);

  return result;
};
