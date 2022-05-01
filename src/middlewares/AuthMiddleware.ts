import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

import ErrorCodes from '../enums/ErrorCodes';
import { IAuthMiddleware } from '../interfaces/auth/IAuthMiddleware';
import { AuthenticationService } from '../shared/auth/auth';
import { IAuthenticationService } from '../shared/auth/interfaces';
import UnauthorizedError from '../shared/errors/UnauthorizedError';

export class AuthMiddleware implements IAuthMiddleware {
  constructor(
    private readonly authService: IAuthenticationService = new AuthenticationService(),
  ) {}

  public authenticationMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    try {
      const token = req.headers?.['x-access-token'];
      if (!token) {
        throw new UnauthorizedError(
          'token not provided',
          ErrorCodes.AUTH_ERROR_001,
        );
      }
      const decodedUser = this.authService.decodeToken(token as string);
      req.user = { ...decodedUser };
      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return next(new UnauthorizedError(error.message));
      }

      next(error);
    }
  }
}

export default new AuthMiddleware();
