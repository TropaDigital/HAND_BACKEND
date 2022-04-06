import { GotAdapter } from '../adapters/http-client/GotAdapter';
import { IHttpClient } from '../interfaces/http-client';

export class HttpClientFactory {
  public static create(): IHttpClient {
    const result = new GotAdapter();

    return result;
  }
}
