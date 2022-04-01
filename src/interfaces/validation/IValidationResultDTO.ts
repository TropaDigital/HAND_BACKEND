import IValidationError from './IValidationError';

export default interface IValidationResultDTO<T = any> {
  hasValidationErrors: boolean;
  value: T;
  validationErrors?: IValidationError[];
}
