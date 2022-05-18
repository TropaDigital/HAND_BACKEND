import { IBcrypt, IEncrypter } from '../../../shared/auth/interfaces';
import { BcryptAdapter } from '../bcrypt';

interface ISut {
  bcryptMock: jest.Mocked<IBcrypt>;
  bcryptAdapter: IEncrypter;
}

const makeBcryptMock = (): jest.Mocked<IBcrypt> => {
  const mock = {
    compare: jest.fn(),
    hash: jest.fn(),
  };

  mock.compare.mockResolvedValue(true);
  mock.hash.mockResolvedValue('hashed_string');

  return mock;
};

const makeSut = (): ISut => {
  const bcryptMock = makeBcryptMock();
  const bcryptAdapter = new BcryptAdapter(bcryptMock);
  return {
    bcryptMock,
    bcryptAdapter,
  };
};

describe('BcryptAdapter unit tests', () => {
  describe('encrypt()', () => {
    it('should return a hashed string', async () => {
      const { bcryptAdapter, bcryptMock } = makeSut();
      const result = await bcryptAdapter.encrypt('value_to_be_hashed', 10);
      expect(bcryptMock.hash).toHaveBeenCalledWith('value_to_be_hashed', 10);
      expect(result).toEqual('hashed_string');
    });

    it('should return a hashed string when no salt is provided', async () => {
      const { bcryptAdapter, bcryptMock } = makeSut();
      const result = await bcryptAdapter.encrypt('value_to_be_hashed');
      expect(bcryptMock.hash).toHaveBeenCalledWith('value_to_be_hashed', 12);
      expect(result).toEqual('hashed_string');
    });
  });

  describe('compareHash()', () => {
    it('should true when provide a hash that matches with cryptografy algorithm', async () => {
      const { bcryptAdapter, bcryptMock } = makeSut();
      const result = await bcryptAdapter.compareHash(
        'original_value',
        'hashed_value',
      );
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        'original_value',
        'hashed_value',
      );
      expect(result).toBeTruthy();
    });
  });
});
