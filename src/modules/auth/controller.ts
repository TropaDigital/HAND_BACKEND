import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';
import { IValidator } from '../../interfaces/validation/IValidator';
import {
  ILoginController,
  ILoginRequestParams,
  ILoginResult,
  ILoginService,
} from './interfaces';
import * as schemas from './schemas';

export class LoginController implements ILoginController {
  constructor(
    private readonly loginService: ILoginService,
    private readonly validator: IValidator<typeof schemas>,
  ) {}

  public async login(
    httpRequest: IApiHttpRequest<ILoginRequestParams>,
  ): Promise<IApiHttpResponse<ILoginResult>> {
    const credentials = this.validator.validateSchema<ILoginRequestParams>(
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
