import ErrorCodes from '../../enums/ErrorCodes';
import GenericAppError from './GenericAppError';

export default class MailerError extends GenericAppError {
  constructor(
    public description = 'Error when trying to send email',
    code = ErrorCodes.GENERIC,
  ) {
    super(
      description || 'Error when trying to send email',
      'INTERNAL_SERVER_ERROR',
      code,
    );
  }
}
