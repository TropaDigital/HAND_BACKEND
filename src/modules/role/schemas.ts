import { Prisma } from '@prisma/client';
import Joi from 'joi';

export const GetRoleById = Joi.object<{ id: number }>({
  id: Joi.number().required(),
});

export const CreateRole = Joi.object<Prisma.RoleCreateInput>({});

export const UpdateRoleById = Joi.object<
  Prisma.RoleUpdateInput & { id: number }
>({
  id: Joi.number().required(),
});

export const DeleteRoleById = Joi.object<{ id: number }>({
  id: Joi.number().required(),
});
