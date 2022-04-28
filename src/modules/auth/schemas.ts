import Joi from 'joi';

import { IAuthRequestParams } from './interfaces';

export const LoginRequestParams = Joi.object<IAuthRequestParams>({
  login: Joi.string().required(),
  password: Joi.string().required(),
});
