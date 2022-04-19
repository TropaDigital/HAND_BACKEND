import Joi from 'joi';

import { IDatabaseConfig } from '../../interfaces/infra/IDatabaseConfig';

export const databaseConfigSchema = Joi.object<IDatabaseConfig>({
  DATABASE_URL: Joi.string().required(),
});
