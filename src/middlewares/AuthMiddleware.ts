import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

import { AuthService } from '../shared/auth/auth';
import UnauthorizedError from '../shared/errors/UnauthorizedError';

class AuthMiddleware {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  public authenticationMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    const token = req.headers['x-access-token'];
    if (!token) {
      throw new UnauthorizedError('token not provided');
    }

    try {
      this.authService.decodeToken(token as string);
      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError(error.message);
      }
      throw new UnauthorizedError();
    }
  }
}

export default new AuthMiddleware();
