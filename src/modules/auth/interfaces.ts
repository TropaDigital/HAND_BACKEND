import { IApiHttpRequest, IApiHttpResponse } from 'src/interfaces/http';

import { ResponseUser } from '../user/interfaces';

export interface ILoginRequestParams {
  login: string;
  password: string;
}

export interface ILoginResult {
  user: ResponseUser;
  token: string;
}

export interface ILoginService {
  authenticate(credentials: ILoginRequestParams): Promise<ILoginResult>;
}

export interface ILoginController {
  login: (
    _request: IApiHttpRequest<ILoginRequestParams>,
  ) => Promise<IApiHttpResponse<ILoginResult>>;
}
