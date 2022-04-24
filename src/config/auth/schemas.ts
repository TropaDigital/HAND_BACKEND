import Joi from 'joi';

import { IAuthConfig } from '../../interfaces/auth/IAuthConfig';

export const authConfigSchema = Joi.object<IAuthConfig>({
  AUTH_SECRET: Joi.string().required(),
  AUTH_SESSION_TTL: Joi.number().required(),
  DEFAULT_PASSWORD: Joi.string().required(),
  JWT_SALT: Joi.number().required(),
});
