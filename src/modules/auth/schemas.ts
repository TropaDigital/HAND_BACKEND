import Joi from 'joi';

import { ILoginRequestParams } from './interfaces';

export const LoginRequestParams = Joi.object<ILoginRequestParams>({
  login: Joi.string().email().required(),
  password: Joi.string().required(),
});
