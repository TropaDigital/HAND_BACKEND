import { Address, Affiliation } from '@prisma/client';
import Joi from 'joi';

export const GetAffiliationById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});

export const CreateAffiliation = Joi.object<Affiliation & { address: Address }>(
  {
    name: Joi.string().required(),
    corporateTaxId: Joi.string().required(),
    address: Joi.object({
      isDefault: Joi.boolean(),
      addressType: Joi.string().required(),
      postalCode: Joi.string().required(),
      street: Joi.string().required(),
      houseNumber: Joi.string().required(),
      complement: Joi.string().allow(null),
      district: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
    }),
  },
);

export const UpdateAffiliationById = Joi.object<
  Affiliation & { address: Address } & { id: number }
>({
  id: Joi.number().required(),
  name: Joi.string(),
  corporateTaxId: Joi.string().required(),
  address: Joi.object({
    isDefault: Joi.boolean(),
    addressType: Joi.string(),
    postalCode: Joi.string(),
    street: Joi.string(),
    houseNumber: Joi.string(),
    complement: Joi.string().allow(null).allow(''),
    district: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
  }),
});

export const DeleteAffiliationById = Joi.object<{ id: number }>({
  id: Joi.number().min(1).required(),
});
