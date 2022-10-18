import { Prisma, Status } from '@prisma/client';
import Joi from 'joi';

export const GetUserByUserName = Joi.object<{ userName: string }>({
  userName: Joi.string().required().min(3),
});

export const CreateUser = Joi.object<Prisma.UserCreateInput>({
  email: Joi.string().email().required(),
  userName: Joi.string().min(3).required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .default(Status.ACTIVE),
});

export const UpdateUserById = Joi.object<
  Prisma.UserUpdateInput & { id: number; roleId?: number }
>({
  id: Joi.number().min(1).required(),
  userName: Joi.string().min(3),
  email: Joi.string().email(),
  name: Joi.string().required(),
  status: Joi.string().valid(...Object.values(Status)),
  roleId: Joi.number().min(1),
});

export const DeleteUserById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});
