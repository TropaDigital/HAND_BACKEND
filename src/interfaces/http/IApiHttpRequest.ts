import { IJwtToken } from '../../shared/auth/interfaces';

export interface IApiHttpRequest<
  Body = any,
  Headers = { [key: string]: string | string[] | undefined },
  Params = { [key: string]: any },
  Query = { [key: string]: any },
> {
  body?: Body;
  headers?: Headers;
  params?: Params;
  query?: Query;
  user?: IJwtToken;
}
