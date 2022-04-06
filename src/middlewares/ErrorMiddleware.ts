import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorHandler, GenericAppError, NotFoundError } from '../shared/errors';

class ErrorMiddleware {
  notFoundMiddleware(_req: Request, _res: Response, next: NextFunction) {
    const err = new NotFoundError();
    next(err);
  }

  // eslint-disable-next-line max-params
  handleErrorMiddleware(
    err: GenericAppError,
    _req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    const handledError = ErrorHandler.handleError(err);
    if (ErrorHandler.isTrustedError(handledError)) {
      next(handledError);
    } else {
      throw err;
    }
  }

  // eslint-disable-next-line
  sendErrorMiddleware(
    err: GenericAppError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    res.locals.message = err.description || err.message;
    res.locals.error =
      process.env.NODE_ENV === 'development' || err.isOperational
        ? {
            code: err.code,
            statusCode: StatusCodes[err.status] || 500,
            statusCodeAsString: err.status || 'INTERNAL_SERVER_ERROR',
            description: err.message || 'Internal Server Error',
            validationErrors: err.validationErrors,
          }
        : {
            code: err.code,
            statusCode: 500,
            statusCodeAsString: 'INTERNAL_SERVER_ERROR',
            description: 'Internal Server Error',
          };
    res.status(err.status || 500).json(res.locals.error);
  }
}

export default new ErrorMiddleware();
