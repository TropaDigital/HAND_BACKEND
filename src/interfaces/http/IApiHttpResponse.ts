import { StatusCodes } from 'http-status-codes';

export interface IApiHttpResponse<
  Body = unknown,
  Headers = { [key: string]: string },
> {
  body: Body;
  headers?: Headers;
  statusCodeAsString: keyof typeof StatusCodes;
}
