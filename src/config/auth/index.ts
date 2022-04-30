import JoiAdapter from '../../adapters/joi/JoiAdapter';
import { IAuthConfig } from '../../interfaces/auth/IAuthConfig';
import {
  InvalidEnvironmentVariableError,
  MissingInvalidParamsError,
} from '../../shared/errors';
import * as schemas from './schemas';

export const authConfig = (shouldThrowException = false): IAuthConfig => {
  try {
    const { AUTH_SECRET, AUTH_SESSION_TTL, DEFAULT_PASSWORD, JWT_SALT } =
      new JoiAdapter<typeof schemas>(schemas).validateSchema<IAuthConfig>(
        'authConfigSchema',
        process.env,
      );
    return {
      AUTH_SECRET,
      AUTH_SESSION_TTL,
      DEFAULT_PASSWORD,
      JWT_SALT,
    };
  } catch (error) {
    if (!shouldThrowException) {
      return {} as IAuthConfig;
    }
    if (error instanceof MissingInvalidParamsError) {
      throw new InvalidEnvironmentVariableError(error.validationErrors);
    }

    throw error;
  }
};
