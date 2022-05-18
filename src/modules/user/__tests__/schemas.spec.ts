import JoiAdapter from '../../../adapters/joi/JoiAdapter';
import * as schemas from '../schemas';
import {
  makeFakeCreateUserInput,
  makeFakeUpdateUserInput,
} from './helpers/test-helper';

const makeSut = () => {
  const sut = new JoiAdapter(schemas);

  return { sut };
};

describe('Schema', () => {
  describe('GetUserByUserName', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { userName: 'any_user_name' };

      const result = sut.validateSchema('GetUserByUserName', param);

      expect(result).toEqual(param);
    });

    it('should return error when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = { id: '' };

      expect(() => sut.validateSchema('GetUserByUserName', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('CreateUser', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = makeFakeCreateUserInput();

      const result = sut.validateSchema('CreateUser', param);

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

      expect(() => sut.validateSchema('CreateUser', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('UpdateUserById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 777, ...makeFakeUpdateUserInput() };

      const result = sut.validateSchema('UpdateUserById', param);

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

      expect(() => sut.validateSchema('UpdateUserById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('DeleteUserById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 2 };

      const result = sut.validateSchema('DeleteUserById', param);

      expect(result).toEqual(param);
    });

    it('should return error when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = { id: '' };

      expect(() => sut.validateSchema('DeleteUserById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });
});
