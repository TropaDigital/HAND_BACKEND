import ErrorCodes from '../../enums/ErrorCodes';
import IValidationError from '../../interfaces/validation/IValidationError';
import GenericAppError from './GenericAppError';

export default class MissingInvalidParamsError extends GenericAppError {
  constructor(
    description = 'Missing or invalid param',
    code = ErrorCodes.GENERIC,
    validationErrors?: IValidationError[],
  ) {
    super(
      description || 'Missing or invalid param',
      'BAD_REQUEST',
      code,
      validationErrors,
    );
  }
}
