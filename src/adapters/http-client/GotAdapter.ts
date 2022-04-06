import got, { OptionsOfJSONResponseBody } from 'got';

import {
  IHttpClient,
  IHttpOptions,
  IHttpResponse,
} from '../../interfaces/http-client';

export class GotAdapter implements IHttpClient {
  async get<T>(url: string, options?: IHttpOptions): Promise<IHttpResponse<T>> {
    const gotOptions: OptionsOfJSONResponseBody = {
      responseType: 'json',
      ...(options as OptionsOfJSONResponseBody),
    };
    const result = await got.get<T>(url, gotOptions);

    return { statusCode: result.statusCode, body: result.body as T };
  }

  public async post<T, K>(
    url: string,
    options?: IHttpOptions,
  ): Promise<IHttpResponse<K>> {
    const gotOptions: OptionsOfJSONResponseBody = {
      responseType: 'json',
      json: options?.body as Record<string, T>,
      headers: options?.headers,
    };

    const result = await got.post<K>(url, gotOptions);

    return { statusCode: result.statusCode, body: result.body as K };
  }
}
