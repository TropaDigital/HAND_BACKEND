import JoiAdapter from '../../adapters/joi/JoiAdapter';
import { IMailerConfig } from '../../interfaces/mailer/IMailer';
import {
  MissingInvalidParamsError,
  InvalidEnvironmentVariableError,
} from '../../shared/errors';
import * as schemas from './schemas';

export const mailerConfig = (shouldThrowException = false): IMailerConfig => {
  try {
    const { MAILER_HOST, MAILER_PASSWORD, MAILER_PORT, MAILER_USERNAME } =
      new JoiAdapter<typeof schemas>(schemas).validateSchema<IMailerConfig>(
        'mailerConfigSchema',
        process.env,
      );
    return {
      MAILER_HOST,
      MAILER_PASSWORD,
      MAILER_PORT,
      MAILER_USERNAME,
    };
  } catch (error) {
    if (!shouldThrowException) {
      return {} as IMailerConfig;
    }

    if (error instanceof MissingInvalidParamsError) {
      throw new InvalidEnvironmentVariableError(error.validationErrors);
    }

    throw error;
  }
};
