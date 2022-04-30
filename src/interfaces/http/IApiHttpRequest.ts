import { ResponseUser } from '../../modules/user/interfaces';

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
  user?: ResponseUser;
}
