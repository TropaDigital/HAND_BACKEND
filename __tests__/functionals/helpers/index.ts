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
import { makeFakeLoginParams } from '../auth/helpers';

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
    new MissingInvalidParamsError(
      undefined,
      ErrorCodes.MISSING_OR_INVALID_PARAMETERS,
      validationErrors,
    ),
  );
};

export const makeInternalErrorResponse = (
  description = 'Internal Server Error',
  code?: ErrorCodes,
): IFormatedError =>
  ErrorMiddleware.formatError(
    new GenericAppError(description, undefined, code),
  );
