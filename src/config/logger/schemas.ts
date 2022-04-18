import Joi from 'joi';

import { ILoggerConfig } from '../../interfaces/logger/ILogger';

export const loggerConfigSchema = Joi.object<ILoggerConfig>({
  LOGGER_ENABLED: Joi.boolean().required(),
  LOGGER_LEVEL: Joi.string().required(),
  LOGGER_PRETTY_PRINT: Joi.boolean().default(false),
});
