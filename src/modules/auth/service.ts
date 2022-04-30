import { IAuthenticationService } from '../../shared/auth/interfaces';
import UnauthorizedError from '../../shared/errors/UnauthorizedError';
import { IUserRepository } from '../user/interfaces';
import { IAuthRequestParams, IAuthResult, IAuthService } from './interfaces';

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthenticationService,
  ) {}

  async authenticate(credentials: IAuthRequestParams): Promise<IAuthResult> {
    const { login: userName, password } = credentials;
    const user = await this.userRepository.findByUserName(userName);

    if (!user) {
      throw new UnauthorizedError('User does not exist in database');
    }

    const { password: hashedPassword, ...responseUser } = user;

    const isPasswordValid = await this.authService.compareHash(
      password,
      hashedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid Password');
    }

    const accessToken = await this.authService.generateToken({
      sub: String(user.userName),
      role: user.role,
    });

    return { user: responseUser, token: accessToken };
  }
}
