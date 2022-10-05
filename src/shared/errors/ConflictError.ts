import ErrorCodes from '../../enums/ErrorCodes';
import GenericAppError from './GenericAppError';

export default class ConflictError extends GenericAppError {
  constructor(
    public description = 'Resource conflict',
    code = ErrorCodes.GENERIC,
  ) {
    super(description || 'Resource conflict', 'CONFLICT', code);
  }
}
