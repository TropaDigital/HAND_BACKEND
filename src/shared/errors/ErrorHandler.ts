import { LoggerFactory } from '../../factories/LoggerFactory';
import GenericAppError from './GenericAppError';

export class ErrorHandler {
  constructor(private readonly logger = LoggerFactory.create()) {}

  isTrustedError(error: GenericAppError): boolean {
    return error.isOperational;
  }

  handleError(error: GenericAppError): GenericAppError {
    if (this.isTrustedError(error)) {
      this.logger.error({
        code: error.code,
        msg: error.description || error.message,
        stack: error.stack,
      });
    } else {
      this.logger.error({ msg: '', stack: error.stack });
    }

    return error;
  }
}

export default new ErrorHandler();
