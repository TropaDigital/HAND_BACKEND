import { Prisma } from '@prisma/client';
import Joi from 'joi';

export const GetUserByEmail = Joi.object<{ email: string }>({
  email: Joi.string().email().required(),
});

export const CreateUser = Joi.object<Prisma.UserCreateInput>({});

export const UpdateUserById = Joi.object<
  Prisma.UserUpdateInput & { id: number }
>({
  id: Joi.number().required(),
});

export const DeleteUserById = Joi.object<{ id: number }>({
  id: Joi.number().required(),
});
