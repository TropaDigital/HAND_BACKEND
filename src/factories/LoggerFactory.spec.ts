import { LoggerManager } from '../services/logger/LoggerManager';
import { LoggerFactory } from './LoggerFactory';

const makeSut = () => {
  const sut = LoggerFactory;

  return { sut };
};

describe(LoggerFactory.name, () => {
  describe(`When ${LoggerFactory.create.name} is called`, () => {
    it(`Should return an ${LoggerManager.name} instance`, () => {
      const { sut } = makeSut();

      const result = sut.create();

      expect(result).toBeInstanceOf(LoggerManager);
    });
  });
});
