import { StatusCodes } from 'http-status-codes';

import IValidationError from '../validation/IValidationError';

export interface IFormatedError {
  code: string;
  statusCode: number;
  statusCodeAsString: keyof typeof StatusCodes;
  description: string;
  validationErrors?: IValidationError[];
}
