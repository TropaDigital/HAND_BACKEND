import JoiAdapter from '../../../adapters/joi/JoiAdapter';
import * as schemas from '../schemas';

const makeSut = () => {
  const sut = new JoiAdapter(schemas);

  return { sut };
};

describe('Schema', () => {
  describe('LoginRequestParams', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { login: 'any_mail@mail.com', password: 'any_password' };

      const result = sut.validateSchema('LoginRequestParams', param);

      expect(result).toEqual(param);
    });

    it('should return error when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = { id: '' };

      expect(() => sut.validateSchema('LoginRequestParams', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });
});
