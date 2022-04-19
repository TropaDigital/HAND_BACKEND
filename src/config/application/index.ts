import JoiAdapter from '../../adapters/joi/JoiAdapter';
import { IApplicationConfig } from '../../interfaces/application/IApplicationConfig';
import {
  InvalidEnvironmentVariableError,
  MissingInvalidParamsError,
} from '../../shared/errors';
import * as schemas from './schemas';

export const applicationConfig = (
  shouldThrowException = false,
): IApplicationConfig => {
  try {
    const { NODE_ENV, PORT } = new JoiAdapter<typeof schemas>(
      schemas,
    ).validateSchema<IApplicationConfig>(
      'applicationConfigSchema',
      process.env,
    );
    return {
      NODE_ENV,
      PORT,
    };
  } catch (error) {
    if (!shouldThrowException) {
      return {} as IApplicationConfig;
    }
    if (error instanceof MissingInvalidParamsError) {
      throw new InvalidEnvironmentVariableError(error.validationErrors);
    }

    throw error;
  }
};
