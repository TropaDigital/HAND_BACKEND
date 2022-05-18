import ErrorCodes from '../../enums/ErrorCodes';
import GenericAppError from './GenericAppError';

export default class UnauthorizedError extends GenericAppError {
  constructor(
    public description = 'User not authenticated',
    code = ErrorCodes.GENERIC,
  ) {
    super(description || 'User not authenticated', 'UNAUTHORIZED', code);
  }
}
