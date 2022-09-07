import { Prisma } from '@prisma/client';
import Joi from 'joi';

export const GetAffiliationById = Joi.object<{ id: number }>({
  id: Joi.number().required(),
});

export const CreateAffiliation = Joi.object<Prisma.AffiliationCreateInput>({
  name: Joi.string().required(),
});

export const UpdateAffiliationById = Joi.object<
  Prisma.AffiliationUpdateInput & { id: number }
>({
  id: Joi.number().required(),
  name: Joi.string(),
  deletedAt: Joi.date(),
});

export const DeleteAffiliationById = Joi.object<{ id: number }>({
  id: Joi.number().required(),
});
