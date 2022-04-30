import { IApiHttpRequest, IApiHttpResponse } from 'src/interfaces/http';

import { ResponseUser } from '../user/interfaces';

export interface IAuthRequestParams {
  login: string;
  password: string;
}

export interface IAuthResult {
  user: ResponseUser;
  token: string;
}

export interface IAuthService {
  authenticate(credentials: IAuthRequestParams): Promise<IAuthResult>;
}

export interface IAuthController {
  me(httpRequest: IApiHttpRequest): Promise<IApiHttpResponse<ResponseUser>>;

  login: (
    _request: IApiHttpRequest<IAuthRequestParams>,
  ) => Promise<IApiHttpResponse<IAuthResult>>;
}
