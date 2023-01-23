/* eslint-disable @typescript-eslint/no-explicit-any */
import IValidationError from './IValidationError';

export default interface IValidationResultDTO<T = any> {
  hasValidationErrors: boolean;
  value: T;
  validationErrors?: IValidationError[];
}
