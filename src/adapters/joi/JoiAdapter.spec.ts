import Joi from 'joi';

import {
  GenericAppError,
  MissingInvalidParamsError,
} from '../../shared/errors';
import JoiAdapter from './JoiAdapter';

const schemas = {
  sampleSchema: Joi.object({
    name: Joi.string().required(),
  }),
} as const;
type Schemas = keyof typeof schemas;

const makeSut = () => {
  const sut = new JoiAdapter(schemas);

  return { sut };
};

describe(JoiAdapter.name, () => {
  describe('validateSchema()', () => {
    it('should throw an error when pass a schema that does not exists', () => {
      const { sut } = makeSut();
      expect(() =>
        sut.validateSchema('schema that does not exists', { name: '' }),
      ).toThrow(new GenericAppError('The schema provided does not exists'));
    });

    it('should not throw an error when pass a schema that does exists', () => {
      const { sut } = makeSut();
      expect(() =>
        sut.validateSchema('sampleSchema' as Schemas, { name: 'valid name' }),
      ).not.toThrow();
    });

    it('should throw an error when pass a payload that does not pass in schema validation', () => {
      const { sut } = makeSut();
      expect(() => sut.validateSchema('sampleSchema' as Schemas, {})).toThrow(
        new MissingInvalidParamsError(undefined, undefined, [
          {
            fieldName: 'name',
            friendlyFieldName: 'name',
            message: '"name" is required',
          },
        ]),
      );
    });

    it('should not throw an error when pass a payload that passes in schema validation and return the value', () => {
      const { sut } = makeSut();
      const result = sut.validateSchema('sampleSchema' as Schemas, {
        name: 'valid name',
      });
      expect(result).toEqual({ name: 'valid name' });
    });
  });
});
