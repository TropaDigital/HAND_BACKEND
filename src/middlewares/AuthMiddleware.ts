import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

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
    const token = req.headers?.['x-access-token'];
    if (!token) {
      next(new UnauthorizedError('token not provided'));
    }

    try {
      const decodedUser = this.authService.decodeToken(token as string);
      req.user = { userName: decodedUser.sub, role: decodedUser.role };
      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        next(new UnauthorizedError(error.message));
      }
      next(new UnauthorizedError());
    }
  }
}

export default new AuthMiddleware();
