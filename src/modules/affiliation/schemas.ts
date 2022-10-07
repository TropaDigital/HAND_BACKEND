import { Prisma } from '@prisma/client';
import Joi from 'joi';

export const GetAffiliationById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});

export const CreateAffiliation = Joi.object<Prisma.AffiliationCreateInput>({
  name: Joi.string().required(),
});

export const UpdateAffiliationById = Joi.object<
  Prisma.AffiliationUpdateInput & { id: number }
>({
  id: Joi.number().min(1).required(),
  name: Joi.string(),
});

export const DeleteAffiliationById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});
