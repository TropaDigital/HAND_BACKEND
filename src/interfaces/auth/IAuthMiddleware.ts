import { NextFunction, Request, Response } from 'express';

export interface IAuthMiddleware {
  authenticationMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void;
}
