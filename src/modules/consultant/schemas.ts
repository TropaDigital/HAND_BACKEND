import { Prisma } from '@prisma/client';
import Joi from 'joi';

export const GetConsultantById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});

export const CreateConsultant = Joi.object<Prisma.ConsultantCreateInput>({
  name: Joi.string().required(),
  taxId: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  commission: Joi.number(),
  createdBy: Joi.string().required(),
});

export const UpdateConsultantById = Joi.object<
  Prisma.ConsultantUpdateInput & { id: number }
>({
  id: Joi.number().min(1).required(),
  name: Joi.string(),
  taxId: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  commission: Joi.number(),
  createdBy: Joi.string(),
});

export const DeleteConsultantById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});
