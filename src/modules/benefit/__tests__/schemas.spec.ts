import JoiAdapter from '../../../adapters/joi/JoiAdapter';
import * as schemas from '../schemas';
import {
  makeFakeCreateBenefitInput,
  makeFakeUpdateBenefitInput,
} from './helpers/test-helper';

const makeSut = () => {
  const sut = new JoiAdapter(schemas);

  return { sut };
};

describe('Schema', () => {
  describe('GetBenefitById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 2 };

      const result = sut.validateSchema('GetBenefitById', param);

      expect(result).toEqual(param);
    });

    it('should return error when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = { id: '' };

      expect(() => sut.validateSchema('GetBenefitById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('CreateBenefit', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = makeFakeCreateBenefitInput();

      const result = sut.validateSchema('CreateBenefit', param);

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

      expect(() => sut.validateSchema('CreateBenefit', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('UpdateBenefitById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 777, ...makeFakeUpdateBenefitInput() };

      const result = sut.validateSchema('UpdateBenefitById', param);

      const { addressId: _, ...benefit } = param;
      expect(result).toEqual(benefit);
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

      expect(() => sut.validateSchema('UpdateBenefitById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('DeleteBenefitById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 2 };

      const result = sut.validateSchema('DeleteBenefitById', param);

      expect(result).toEqual(param);
    });

    it('should return error when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = { id: '' };

      expect(() => sut.validateSchema('DeleteBenefitById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });
});
