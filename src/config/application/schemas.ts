import Joi from 'joi';

import { IApplicationConfig } from '../../interfaces/application/IApplicationConfig';

export const applicationConfigSchema = Joi.object<IApplicationConfig>({
  NODE_ENV: Joi.string()
    .valid('production', 'homolog', 'development', 'test')
    .required(),
  PORT: Joi.number().required(),
});
