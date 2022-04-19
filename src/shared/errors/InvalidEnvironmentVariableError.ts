import IValidationError from '../../interfaces/validation/IValidationError';

export default class InvalidEnviromentVariableError extends Error {
  constructor(public readonly errorDetails: IValidationError[]) {
    super(
      `Missing or invalid environment variable - ${JSON.stringify(
        errorDetails,
        null,
        2,
      )}`,
    );
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
