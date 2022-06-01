import { IApiHttpRequest, IApiHttpResponse } from 'src/interfaces/http';

import { IResponseUser } from '../user/interfaces';

export interface IAuthRequestParams {
  login: string;
  password: string;
}

export interface IAuthResult {
  user: IResponseUser;
  token: string;
}

export interface IAuthService {
  authenticate(credentials: IAuthRequestParams): Promise<IAuthResult>;
}

export interface IAuthController {
  me(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<IResponseUser>>;

  login: (
    _request: IApiHttpRequest<IAuthRequestParams>,
  ) => Promise<IApiHttpResponse<IAuthResult>>;
}
