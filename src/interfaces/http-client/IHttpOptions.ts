import { IHttpHeaders } from '.';

export interface IHttpOptions<T = unknown> {
  headers?: IHttpHeaders;
  body?: T;
}
