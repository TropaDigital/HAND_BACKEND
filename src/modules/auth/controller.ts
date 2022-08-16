import { JsonWebTokenError } from 'jsonwebtoken';

import { authConfig } from '../../config/auth';
import ErrorCodes from '../../enums/ErrorCodes';
import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';
import { IValidator } from '../../interfaces/validation/IValidator';
import { AuthenticationService } from '../../shared/auth/auth';
import {
  IAuthenticationService,
  IJwtToken,
} from '../../shared/auth/interfaces';
import { NotFoundError, UnauthorizedError } from '../../shared/errors';
import { IUserService, IResponseUser } from '../user/interfaces';
import {
  IAuthController,
  IAuthRequestParams,
  IAuthResult,
  IAuthService,
  IResetPasswordPayload,
} from './interfaces';
import * as schemas from './schemas';

export class AuthController implements IAuthController {
  constructor(
    private readonly authService: IAuthService,
    private readonly userService: IUserService,
    private readonly validator: IValidator<typeof schemas>,
    private readonly authenticationService: IAuthenticationService = new AuthenticationService(),
  ) {}

  public async updateUserPassword(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse> {
    try {
      const { password, token } =
        this.validator.validateSchema<IResetPasswordPayload>('ResetPassword', {
          ...httpRequest.body,
          ...httpRequest.query,
        });

      const decodedToken = await this.authenticationService.decodeToken(token);
      await this.userService.updateById(decodedToken.sub as number, {
        password: await this.authenticationService.hashPassword(
          password,
          authConfig().JWT_SALT,
        ),
      });

      return {
        body: '',
        statusCodeAsString: 'NO_CONTENT',
      };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError(
          'the provided token is not valid',
          ErrorCodes.FORGOT_PASSWORD_002,
        );
      }

      throw error;
    }
  }

  public async me(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<IResponseUser>> {
    const { sub: userName } = httpRequest.user as IJwtToken;
    const result = await this.userService.getByUserName(userName as string);
    if (!result) {
      throw new NotFoundError('User not found');
    }

    return { statusCodeAsString: 'OK', body: result };
  }

  public async login(
    httpRequest: IApiHttpRequest<IAuthRequestParams>,
  ): Promise<IApiHttpResponse<IAuthResult>> {
    const credentials = this.validator.validateSchema<IAuthRequestParams>(
      'LoginRequestParams',
      httpRequest.body,
    );

    const authenticationModel = await this.authService.authenticate(
      credentials,
    );

    return {
      statusCodeAsString: 'OK',
      body: authenticationModel,
    };
  }

  public async generateAndSendLinkOfResetPassword(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse> {
    const { email } = this.validator.validateSchema<{ email: string }>(
      'ForgotPassword',
      httpRequest.query,
    );

    await this.userService.generateAndSendLinkOfResetPassword(email);

    return {
      body: '',
      statusCodeAsString: 'NO_CONTENT',
    };
  }
}
