import { StatusCodes } from 'http-status-codes';

export interface IFormatedApiHttpResponse<T = unknown> {
  statusCode: number;
  statusCodeAsString: keyof typeof StatusCodes;
  data: T;
}
