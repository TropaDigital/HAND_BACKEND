import jwt from 'jsonwebtoken';

import { AuthService } from '../auth';
import { IEncrypter } from '../interfaces';

jest.mock('jsonwebtoken');
jest
  .spyOn(jwt, 'verify')
  .mockImplementation(() => ({ role: 'any_value', sub: 'any_sub' }));
jest.spyOn(jwt, 'sign').mockImplementation(() => 'any_value');

const makeEncrypterStub = (): jest.Mocked<IEncrypter> => ({
  compareHash: jest.fn().mockResolvedValue(true),
  encrypt: jest.fn().mockResolvedValue('any_hash'),
});

jest.mock('../../../config/auth', () => ({
  authConfig: () => ({
    AUTH_SECRET: 'any_secret',
    AUTH_SESSION_TTL: 'any_ttl',
    DEFAULT_PASSWORD: 'any_password',
    JWT_SALT: '5',
  }),
}));

const makeSut = () => {
  const encrypterStub = makeEncrypterStub();
  const sut = new AuthService(encrypterStub);

  return { sut, encrypterStub };
};

describe(AuthService.name, () => {
  describe(AuthService.prototype.compareHash.name, () => {
    const password = 'any_password';
    const hashedPassword = 'any_hashed_password';

    it('Should call encrypter when method is called', async () => {
      const { sut, encrypterStub } = makeSut();
      const compareHashSpy = encrypterStub.compareHash;
      await sut.compareHash(password, hashedPassword);

      expect(compareHashSpy).toBeCalledWith(
        'any_password',
        'any_hashed_password',
      );
    });

    it('Should return true when encrypter returns true', async () => {
      const { sut } = makeSut();

      const result = await sut.compareHash(password, hashedPassword);

      expect(result).toBe(true);
    });

    it('Should return false when encrypter returns false', async () => {
      const { sut, encrypterStub } = makeSut();
      encrypterStub.compareHash.mockResolvedValueOnce(false);

      const result = await sut.compareHash(password, hashedPassword);

      expect(result).toBe(false);
    });

    it('Should throw when encrypter throws', async () => {
      const { sut, encrypterStub } = makeSut();
      encrypterStub.compareHash.mockRejectedValueOnce(
        new Error('any_encrypter_error'),
      );
      const promise = sut.compareHash(password, hashedPassword);

      await expect(promise).rejects.toThrowError(
        new Error('any_encrypter_error'),
      );
    });
  });

  describe(AuthService.prototype.hashPassword.name, () => {
    const password = 'any_password';
    const salt = 9;

    it('Should call encrypter when method is called', async () => {
      const { sut, encrypterStub } = makeSut();
      const compareHashSpy = encrypterStub.encrypt;
      await sut.hashPassword(password, salt);

      expect(compareHashSpy).toBeCalledWith('any_password', 9);
    });

    it('Should call encrypter when method is called without salt', async () => {
      const { sut, encrypterStub } = makeSut();
      const compareHashSpy = encrypterStub.encrypt;
      await sut.hashPassword(password);

      expect(compareHashSpy).toBeCalledWith('any_password', 10);
    });

    it('Should return true when encrypter returns true', async () => {
      const { sut } = makeSut();

      const result = await sut.hashPassword(password, salt);

      expect(result).toBe('any_hash');
    });

    it('Should throw when encrypter throws', async () => {
      const { sut, encrypterStub } = makeSut();
      encrypterStub.encrypt.mockRejectedValueOnce(
        new Error('any_encrypter_error'),
      );

      const promise = sut.hashPassword(password, salt);

      await expect(promise).rejects.toThrowError(
        new Error('any_encrypter_error'),
      );
    });
  });

  describe(AuthService.prototype.decodeToken.name, () => {
    const token = 'any_token';

    it('Should call jwt when method is called', async () => {
      const { sut } = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');

      await sut.decodeToken(token);

      expect(verifySpy).toBeCalledWith('any_token', 'any_secret');
    });

    it('Should return jwt result when success', async () => {
      const { sut } = makeSut();

      const result = await sut.decodeToken(token);

      expect(result).toEqual({ role: 'any_value', sub: 'any_sub' });
    });

    it('Should throw when jwt throws', async () => {
      const { sut } = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error('any_jwt_error');
      });

      expect(() => sut.decodeToken(token)).toThrow(new Error('any_jwt_error'));
    });
  });
  describe(AuthService.prototype.generateToken.name, () => {
    const payload = { sub: 'any_sub', role: 'any_role' };

    it('Should call jwt when method is called', async () => {
      const { sut } = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');
      await sut.generateToken(payload);

      expect(signSpy).toBeCalledWith(
        { role: { name: 'any_role' }, sub: 'any_sub' },
        'any_secret',
        { expiresIn: 'any_ttl' },
      );
    });

    it('Should return jwt result when success', async () => {
      const { sut } = makeSut();

      const result = await sut.generateToken(payload);

      expect(result).toBe('any_value');
    });

    it('Should throw when jwt throws', async () => {
      const { sut } = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error('any_jwt_error');
      });

      expect(() => sut.generateToken(payload)).toThrow(
        new Error('any_jwt_error'),
      );
    });
  });
});
