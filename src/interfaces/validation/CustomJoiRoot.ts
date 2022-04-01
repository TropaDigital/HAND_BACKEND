import Joi from 'joi';

interface CustomJoiRoot extends Joi.Root {
  [key: string]: (() => Joi.Schema) | any | undefined;
}

export default CustomJoiRoot;
