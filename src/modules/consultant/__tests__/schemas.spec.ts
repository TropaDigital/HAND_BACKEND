import Joi from 'joi';

import JoiAdapter from '../../../adapters/joi/JoiAdapter';
import * as schemas from '../schemas';
import {
  makeFakeCreateConsultantInput,
  makeFakeUpdateConsultantInput,
} from './helpers/test-helper';

const makeSut = () => {
  const sut = new JoiAdapter(schemas);

  return { sut };
};

describe('Schema', () => {
  describe('GetConsultantById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 2 };

      const result = sut.validateSchema('GetConsultantById', param);

      expect(result).toEqual(param);
    });

    it('should return error when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = { id: '' };

      expect(() => sut.validateSchema('GetConsultantById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('CreateConsultant', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = makeFakeCreateConsultantInput();

      const result = sut.validateSchema('CreateConsultant', param);

      expect(result).toEqual(param);
    });

    it('should throw when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = {
        name: 1,
        taxId: 2,
        city: 2,
        state: 1,
        commission: '10',
        createdBy: 2,
      };

      expect(() => sut.validateSchema('CreateConsultant', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('UpdateConsultant', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 777, ...makeFakeUpdateConsultantInput() };

      const result = sut.validateSchema('UpdateConsultant', param);

      expect(result).toEqual(param);
    });

    it('should throw when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = {
        name: 1,
        taxId: 2,
        city: 2,
        state: 1,
        commission: '10',
        createdBy: 2,
      };

      expect(() => sut.validateSchema('UpdateConsultant', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('DeleteConsultantById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 2 };

      const result = sut.validateSchema('DeleteConsultantById', param);

      expect(result).toEqual(param);
    });

    it('should return error when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = { id: '' };

      expect(() => sut.validateSchema('DeleteConsultantById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });
});
