import { IHttpOptions, IHttpResponse } from '.';

export interface IHttpClient {
  get<T>(uri: string, options: IHttpOptions): Promise<IHttpResponse<T>>;

  post<T, K>(uri: string, options: IHttpOptions<T>): Promise<IHttpResponse<K>>;
}
