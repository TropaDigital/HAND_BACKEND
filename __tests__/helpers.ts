import { IFormatedError } from '../src/interfaces/errors/IFormatedError';
import IValidationErrors from '../src/interfaces/validation/IValidationError';
import { ErrorMiddleware } from '../src/middlewares/ErrorMiddleware';
import {
  NotFoundError,
  MissingInvalidParamsError,
  GenericAppError,
  UnauthorizedError,
} from '../src/shared/errors';

export const makeNotFoundResponse = (description?: string): IFormatedError => {
  return ErrorMiddleware.formatError(new NotFoundError(description));
};

export const makeUnauthorizedResponse = (
  description?: string,
): IFormatedError => {
  return ErrorMiddleware.formatError(new UnauthorizedError(description));
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
): IFormatedError =>
  ErrorMiddleware.formatError(new GenericAppError(description));
