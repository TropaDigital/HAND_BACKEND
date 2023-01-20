import JoiAdapter from '../../../adapters/joi/JoiAdapter';
import * as schemas from '../schemas';
import {
  makeFakeCreateAffiliationInput,
  makeFakeUpdateAffiliationInput,
} from './helpers/test-helper';

const makeSut = () => {
  const sut = new JoiAdapter(schemas);

  return { sut };
};

describe('Schema', () => {
  describe('GetAffiliationById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 2 };

      const result = sut.validateSchema('GetAffiliationById', param);

      expect(result).toEqual(param);
    });

    it('should return error when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = { id: '' };

      expect(() => sut.validateSchema('GetAffiliationById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('CreateAffiliation', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = makeFakeCreateAffiliationInput();

      const result = sut.validateSchema('CreateAffiliation', param);

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

      expect(() => sut.validateSchema('CreateAffiliation', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('UpdateAffiliationById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = {
        id: 777,
        ...makeFakeUpdateAffiliationInput(),
        deletedAt: undefined,
      };

      const result = sut.validateSchema('UpdateAffiliationById', param);

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

      expect(() => sut.validateSchema('UpdateAffiliationById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('DeleteAffiliationById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 2 };

      const result = sut.validateSchema('DeleteAffiliationById', param);

      expect(result).toEqual(param);
    });

    it('should return error when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = { id: '' };

      expect(() => sut.validateSchema('DeleteAffiliationById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });
});
