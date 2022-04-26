import jwt from 'jsonwebtoken';

import { BcryptAdapter } from '../../adapters/encrypter/bcrypt';
import { authConfig } from '../../config/auth';
import { IAuthService, IEncrypter, IJwtToken } from './interfaces';

export class AuthService implements IAuthService {
  constructor(private readonly encrypter: IEncrypter = new BcryptAdapter()) {}

  public async hashPassword(password: string, salt = 10): Promise<string> {
    return this.encrypter.encrypt(password, salt);
  }

  public async compareHash(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return this.encrypter.compareHash(password, hashedPassword);
  }

  public generateToken(payload: {
    sub: string | number;
    role: string;
  }): string {
    return jwt.sign(
      { sub: payload.sub, role: payload.role },
      authConfig().AUTH_SECRET,
      {
        expiresIn: authConfig().AUTH_SESSION_TTL,
      },
    );
  }

  public decodeToken(token: string): IJwtToken {
    const { role, sub } = jwt.verify(
      token,
      authConfig().AUTH_SECRET,
    ) as IJwtToken;

    return { role, sub };
  }
}
