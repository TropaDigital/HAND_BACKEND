import { Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

import { IAuthenticationService } from '../../shared/auth/interfaces';
import { UnauthorizedError } from '../../shared/errors';
import { AuthMiddleware } from '../AuthMiddleware';

const makeFakeAuthenticationService =
  (): jest.Mocked<IAuthenticationService> => ({
    compareHash: jest.fn(),
    decodeToken: jest
      .fn()
      .mockReturnValue({ sub: 'any_sub', role: 'any_role' }),
    generateToken: jest.fn(),
    hashPassword: jest.fn(),
  });

const makeSut = () => {
  const reqStub: jest.Mocked<Request> = {
    headers: {},
  } as jest.Mocked<Request>;

  const resStub: jest.Mocked<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<Response>;

  const nextSpy = jest.fn();
  const authServiceStub = makeFakeAuthenticationService();
  const sut = new AuthMiddleware(authServiceStub);

  return { sut, authServiceStub, reqStub, resStub, nextSpy };
};

describe(AuthMiddleware.name, () => {
  describe(AuthMiddleware.prototype.authenticationMiddleware.name, () => {
    it('should call next with unauthorized error when headers is not provided', async () => {
      const { sut, reqStub, resStub, nextSpy } = makeSut();

      sut.authenticationMiddleware(reqStub, resStub, nextSpy);

      expect(nextSpy).toBeCalledWith(
        new UnauthorizedError('token not provided'),
      );
    });

    it('should call next with unauthorized error when token is not provided', async () => {
      const { sut, reqStub, resStub, nextSpy } = makeSut();
      reqStub.headers = {};
      sut.authenticationMiddleware(reqStub, resStub, nextSpy);

      expect(nextSpy).toBeCalledWith(
        new UnauthorizedError('token not provided'),
      );
    });

    it('should call next with unauthorized when token is provided but decode function throws jwt error', async () => {
      const { sut, reqStub, resStub, nextSpy, authServiceStub } = makeSut();
      authServiceStub.decodeToken.mockImplementationOnce(() => {
        throw new JsonWebTokenError('any_decode_error');
      });
      reqStub.headers['x-access-token'] = 'any_token';

      sut.authenticationMiddleware(reqStub, resStub, nextSpy);

      expect(nextSpy).toBeCalledWith(new UnauthorizedError('any_decode_error'));
    });

    it('should call next with unauthorized when token is provided but decode function throws generic error', async () => {
      const { sut, reqStub, resStub, nextSpy, authServiceStub } = makeSut();
      authServiceStub.decodeToken.mockImplementationOnce(() => {
        throw new Error('any_decode_error');
      });
      reqStub.headers['x-access-token'] = 'any_token';

      sut.authenticationMiddleware(reqStub, resStub, nextSpy);

      expect(nextSpy).toBeCalledWith(new UnauthorizedError());
    });

    it('should call next without params when token is correct', async () => {
      const { sut, reqStub, resStub, nextSpy } = makeSut();
      reqStub.headers['x-access-token'] = 'any_token';

      sut.authenticationMiddleware(reqStub, resStub, nextSpy);

      expect(nextSpy).toBeCalledWith();
    });
  });
});
