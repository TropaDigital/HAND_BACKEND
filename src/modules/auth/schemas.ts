import Joi from 'joi';

export const LoginRequestParams = Joi.object<{
  email: string;
  password: string;
}>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
