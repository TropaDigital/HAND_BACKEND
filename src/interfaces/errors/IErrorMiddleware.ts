import { Request, Response, NextFunction } from 'express';

import { GenericAppError } from '../../shared/errors';

export interface IErrorMiddleware {
  notFoundMiddleware: (
    _req: Request,
    _res: Response,
    next: NextFunction,
  ) => void;

  handleErrorMiddleware: (
    err: GenericAppError,
    _req: Request,
    _res: Response,
    next: NextFunction,
  ) => void;
  sendErrorMiddleware: (
    err: GenericAppError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => void;
}
