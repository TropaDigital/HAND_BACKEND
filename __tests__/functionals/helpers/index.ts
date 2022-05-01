import { Prisma, User } from '@prisma/client';

import ErrorCodes from '../../../src/enums/ErrorCodes';
import { IFormatedError } from '../../../src/interfaces/errors/IFormatedError';
import IValidationErrors from '../../../src/interfaces/validation/IValidationError';
import { ErrorMiddleware } from '../../../src/middlewares/ErrorMiddleware';
import { createAuthService } from '../../../src/modules/auth/factories';
import {
  NotFoundError,
  MissingInvalidParamsError,
  GenericAppError,
  UnauthorizedError,
} from '../../../src/shared/errors';
import { makeFakeLoginParams } from '../auth/helpers/TestHelper';

export const makeFakeUser = (
  payload?: Partial<User>,
): Prisma.UserCreateInput => ({
  email: 'any@mail.com',
  userName: 'any_user_name',
  name: 'Mateus',
  password: 'any_password',
  status: 'ACTIVE',
  role: 'USER',
  ...payload,
});

export const populateDatabase = async (): Promise<void> => {
  await global.prismaClient.user.deleteMany({});
  await global.prismaClient.user.createMany({
    data: [
      makeFakeUser({
        name: 'João',
        id: 1,
        userName: 'joao',
        email: 'joao@mail.com',
        password:
          '$2a$12$e.3b/dnS4Ydw9Y8pTF1Gm.YOkTZbe5ELtcE4Sp6W93Pzwrt3Lg8Wa',
      }),
      makeFakeUser({
        name: 'Pedro',
        userName: 'pedro',
        id: 2,
        email: 'pedro@mail.com',
        password:
          '$2a$12$e.3b/dnS4Ydw9Y8pTF1Gm.YOkTZbe5ELtcE4Sp6W93Pzwrt3Lg8Wa',
      }),
    ],
  });
};

export const getFakeToken = async (): Promise<string> => {
  const params = makeFakeLoginParams();
  const authService = createAuthService();
  const authResult = await authService.authenticate(params);
  const result = authResult.token;

  return result;
};

export const makeNotFoundResponse = (description?: string): IFormatedError => {
  return ErrorMiddleware.formatError(new NotFoundError(description));
};

export const makeUnauthorizedResponse = (
  description?: string,
  code?: ErrorCodes,
): IFormatedError => {
  return ErrorMiddleware.formatError(new UnauthorizedError(description, code));
};

export const makeInvalidParamsResponse = (
  validationErrors: IValidationErrors[],
): IFormatedError => {
  return ErrorMiddleware.formatError(
    new MissingInvalidParamsError(undefined, undefined, validationErrors),
  );
};

export const makeInternalErrorResponse = (
  description = 'Internal Server Error',
  code?: ErrorCodes,
): IFormatedError =>
  ErrorMiddleware.formatError(
    new GenericAppError(description, undefined, code),
  );
