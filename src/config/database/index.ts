import JoiAdapter from '../../adapters/joi/JoiAdapter';
import { IDatabaseConfig } from '../../interfaces/infra/IDatabaseConfig';
import {
  InvalidEnvironmentVariableError,
  MissingInvalidParamsError,
} from '../../shared/errors';
import * as schemas from './schemas';

export const databaseConfig = (
  shouldThrowException = false,
): IDatabaseConfig => {
  try {
    const { DATABASE_URL } = new JoiAdapter<typeof schemas>(
      schemas,
    ).validateSchema<IDatabaseConfig>('databaseConfigSchema', process.env);
    return {
      DATABASE_URL,
    };
  } catch (error) {
    if (!shouldThrowException) {
      return {} as IDatabaseConfig;
    }
    if (error instanceof MissingInvalidParamsError) {
      throw new InvalidEnvironmentVariableError(error.validationErrors);
    }

    throw error;
  }
};
