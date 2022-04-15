import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import ErrorCodes from '../enums/ErrorCodes';
import { LoggerFactory } from '../factories/LoggerFactory';
import { IFormatedError } from '../interfaces/errors/IFormatedError';
import { ILogger } from '../interfaces/logger/ILogger';
import { GenericAppError, NotFoundError } from '../shared/errors';

export class ErrorMiddleware implements ErrorMiddleware {
  constructor(private readonly logger: ILogger = LoggerFactory.create()) {}

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
    if (err.isOperational) {
      this.logger.error({
        code: err.code,
        msg: err.description || err.message,
        stack: err.stack,
      });

      next(err);
      return;
    }

    this.logger.error({ msg: err.message, stack: err.stack });
    return next(err);
  }

  // eslint-disable-next-line
  public sendErrorMiddleware(
    err: GenericAppError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void {
    const error = ErrorMiddleware.formatError(err);
    res.status(error.statusCode).json(error);
  }

  public static formatError(error: GenericAppError): IFormatedError {
    return error.isOperational
      ? {
          code: error.code,
          statusCode: StatusCodes[error.status],
          statusCodeAsString: error.status,
          description: error.message,
          validationErrors: error.validationErrors,
        }
      : {
          code: ErrorCodes.GENERIC,
          statusCode: 500,
          statusCodeAsString: 'INTERNAL_SERVER_ERROR',
          description: 'Internal Server Error',
        };
  }
}

export default new ErrorMiddleware();
