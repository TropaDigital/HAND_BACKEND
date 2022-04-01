import { StatusCodes } from 'http-status-codes';

import ErrorCodes from '../../enums/ErrorCodes';
import GenericAppError from './GenericAppError';

export default class NotFoundError extends GenericAppError {
  constructor(
    public description = 'Request Not Found',
    code = ErrorCodes.GENERIC,
  ) {
    super(description, StatusCodes.NOT_FOUND, code);
  }
}
