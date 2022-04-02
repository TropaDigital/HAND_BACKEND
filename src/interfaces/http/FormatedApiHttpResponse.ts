import { StatusCodes } from 'http-status-codes';

export interface IHttpFormatedResponse<T = unknown> {
  statusCode: number;
  statusCodeAsString: keyof typeof StatusCodes;
  data: T;
}
