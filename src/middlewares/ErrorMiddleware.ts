import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import IValidationError from '../interfaces/validation/IValidationError';
import { ErrorHandler, GenericAppError, NotFoundError } from '../shared/errors';

export interface IFormatedError {
  code: string;
  statusCode: number;
  statusCodeAsString: keyof typeof StatusCodes;
  description: string;
  validationErrors?: IValidationError[];
}

class ErrorMiddleware {
  public notFoundMiddleware(
    _req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    const err = new NotFoundError();
    next(err);
  }

  // eslint-disable-next-line max-params
  public handleErrorMiddleware(
    err: GenericAppError,
    _req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    const handledError = ErrorHandler.handleError(err);
    if (ErrorHandler.isTrustedError(handledError)) {
      next(handledError);
    } else {
      throw err;
    }
  }

  // eslint-disable-next-line
  public sendErrorMiddleware(
    err: GenericAppError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void {
    const error = this.formatError(err);
    res.status(error.statusCode).json(error);
  }

  private formatError(error: GenericAppError): IFormatedError {
    return process.env.NODE_ENV === 'development' || error.isOperational
      ? {
          code: error.code,
          statusCode: StatusCodes[error.status] || 500,
          statusCodeAsString: error.status || 'INTERNAL_SERVER_ERROR',
          description: error.message || 'Internal Server Error',
          validationErrors: error.validationErrors,
        }
      : {
          code: error.code,
          statusCode: 500,
          statusCodeAsString: 'INTERNAL_SERVER_ERROR',
          description: 'Internal Server Error',
        };
  }
}

export default new ErrorMiddleware();
