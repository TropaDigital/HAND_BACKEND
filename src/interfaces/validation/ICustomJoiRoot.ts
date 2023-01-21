/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi';

interface ICustomJoiRoot extends Joi.Root {
  [key: string]: (() => Joi.Schema) | any | undefined;
}

export default ICustomJoiRoot;
