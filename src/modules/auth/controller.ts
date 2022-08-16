import { IJwtToken } from 'src/shared/auth/interfaces';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';
import { IValidator } from '../../interfaces/validation/IValidator';
import { NotFoundError } from '../../shared/errors';
import { IUserService, IResponseUser } from '../user/interfaces';
import {
  IAuthController,
  IAuthRequestParams,
  IAuthResult,
  IAuthService,
} from './interfaces';
import * as schemas from './schemas';

export class AuthController implements IAuthController {
  constructor(
    private readonly authService: IAuthService,
    private readonly userService: IUserService,
    private readonly validator: IValidator<typeof schemas>,
  ) {}

  public async me(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<IResponseUser>> {
    const { sub: userName } = httpRequest.user as IJwtToken;
    const result = await this.userService.getByUserName(userName);
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
      'ResetPassword',
      httpRequest.query,
    );

    await this.userService.generateAndSendLinkOfResetPassword(email);

    return {
      body: '',
      statusCodeAsString: 'NO_CONTENT',
    };
  }
}
