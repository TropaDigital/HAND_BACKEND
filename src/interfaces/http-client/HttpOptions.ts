import { HttpHeaders } from '.';

export interface HttpOptions<T = unknown> {
  headers?: HttpHeaders;
  body?: T;
}
