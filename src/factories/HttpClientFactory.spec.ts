import { GotAdapter } from '../adapters/http-client/GotAdapter';
import { HttpClientFactory } from './HttpClientFactory';

const makeSut = () => {
  const sut = HttpClientFactory;

  return { sut };
};

describe(HttpClientFactory.name, () => {
  describe(`When ${HttpClientFactory.create.name} is called`, () => {
    it(`Should return a ${GotAdapter.name} instance`, () => {
      const { sut } = makeSut();

      const result = sut.create();

      expect(result).toBeInstanceOf(GotAdapter);
    });
  });
});
