import Joi from 'joi';

import { IMailerConfig } from '../../interfaces/mailer/IMailer';

export const mailerConfigSchema = Joi.object<IMailerConfig>({
  MAILER_HOST: Joi.string().required(),
  MAILER_USERNAME: Joi.string().required(),
  MAILER_PASSWORD: Joi.string().required(),
  MAILER_PORT: Joi.number().required(),
});
