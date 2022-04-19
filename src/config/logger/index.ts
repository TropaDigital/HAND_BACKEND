import JoiAdapter from '../../adapters/joi/JoiAdapter';
import { ILoggerConfig } from '../../interfaces/logger/ILogger';
import {
  MissingInvalidParamsError,
  InvalidEnvironmentVariableError,
} from '../../shared/errors';
import * as schemas from './schemas';

export const loggerConfig = (shouldThrowException = false): ILoggerConfig => {
  try {
    const { LOGGER_ENABLED, LOGGER_LEVEL, LOGGER_PRETTY_PRINT } =
      new JoiAdapter<typeof schemas>(schemas).validateSchema<ILoggerConfig>(
        'loggerConfigSchema',
        process.env,
      );
    return {
      LOGGER_ENABLED,
      LOGGER_LEVEL,
      LOGGER_PRETTY_PRINT,
    };
  } catch (error) {
    if (!shouldThrowException) {
      return {} as ILoggerConfig;
    }

    if (error instanceof MissingInvalidParamsError) {
      throw new InvalidEnvironmentVariableError(error.validationErrors);
    }

    throw error;
  }
};
