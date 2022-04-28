import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';
import { IValidator } from '../../interfaces/validation/IValidator';
import {
  IAuthController,
  IAuthRequestParams,
  IAuthResult,
  IAuthService,
} from './interfaces';
import * as schemas from './schemas';

export class AuthController implements IAuthController {
  constructor(
    private readonly loginService: IAuthService,
    private readonly validator: IValidator<typeof schemas>,
  ) {}

  public async login(
    httpRequest: IApiHttpRequest<IAuthRequestParams>,
  ): Promise<IApiHttpResponse<IAuthResult>> {
    const credentials = this.validator.validateSchema<IAuthRequestParams>(
      'LoginRequestParams',
      httpRequest.body,
    );

    const authenticationModel = await this.loginService.authenticate(
      credentials,
    );

    return {
      statusCodeAsString: 'OK',
      body: authenticationModel,
    };
  }
}
