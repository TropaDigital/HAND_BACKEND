import { GotAdapter } from '../adapters/http-client/GotAdapter';
import { HttpClient } from '../interfaces/http-client';

export class HttpClientFactory {
  public static create(): HttpClient {
    const result = new GotAdapter();

    return result;
  }
}
