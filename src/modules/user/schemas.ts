import { Prisma } from '@prisma/client';
import Joi from 'joi';

export const GetUserByEmail = Joi.object<{ email: string }>({
  email: Joi.string().email().required(),
});

export const CreateUser = Joi.object<Prisma.UserCreateInput>({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  status: Joi.string().required(),
  role: Joi.string().required(),
});

export const UpdateUserById = Joi.object<
  Prisma.UserUpdateInput & { id: number }
>({
  id: Joi.number().required(),
  email: Joi.string().email(),
  name: Joi.string().required(),
  password: Joi.string(),
  status: Joi.string(),
  role: Joi.string(),
});

export const DeleteUserById = Joi.object<{ id: number }>({
  id: Joi.number().required().min(1),
});
