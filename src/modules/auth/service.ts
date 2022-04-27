import { IAuthService } from '../../shared/auth/interfaces';
import UnauthorizedError from '../../shared/errors/UnauthorizedError';
import { IUserRepository } from '../user/interfaces';
import { ILoginRequestParams, ILoginResult, ILoginService } from './interfaces';

export class LoginService implements ILoginService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService,
  ) {}

  async authenticate(credentials: ILoginRequestParams): Promise<ILoginResult> {
    const { login: email, password } = credentials;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError();
    }

    const { password: hashedPassword, ...responseUser } = user;

    const isPasswordValid = await this.authService.compareHash(
      password,
      hashedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError();
    }

    const accessToken = await this.authService.generateToken({
      sub: String(user.id),
      role: { name: user.role },
    });

    return { user: responseUser, token: accessToken };
  }
}
