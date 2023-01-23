/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi';

export interface IValidator<S = { [key: string]: Joi.Schema }> {
  validateSchema<T>(schemaName: keyof S, data: any): T;
}
