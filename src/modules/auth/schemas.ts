import Joi from 'joi';

import { IAuthRequestParams, IResetPasswordPayload } from './interfaces';

export const LoginRequestParams = Joi.object<IAuthRequestParams>({
  login: Joi.string().required(),
  password: Joi.string().required(),
});

export const ForgotPassword = Joi.object<{ email: string }>({
  email: Joi.string().email().required(),
});

export const ResetPassword = Joi.object<IResetPasswordPayload>({
  token: Joi.string().required(),
  password: Joi.string().required(),
});
