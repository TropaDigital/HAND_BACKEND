import { Prisma } from '@prisma/client';
import Joi from 'joi';

export const GetRoleById = Joi.object<{ id: number }>({
  id: Joi.number().required(),
});

export const CreateRole = Joi.object<Prisma.RoleCreateInput>({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

export const UpdateRoleById = Joi.object<
  Prisma.RoleUpdateInput & { id: number }
>({
  id: Joi.number().required(),
  name: Joi.string(),
  description: Joi.string(),
});

export const DeleteRoleById = Joi.object<{ id: number }>({
  id: Joi.number().required(),
});
