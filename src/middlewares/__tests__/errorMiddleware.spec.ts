import { Request, Response } from 'express';

import { makeLoggerManagerStub } from '../../infra/mySql/mySqlClient.spec';
import { IErrorMiddleware } from '../../interfaces/errors/IErrorMiddleware';
import { ILogger } from '../../interfaces/logger/ILogger';
import {
  GenericAppError,
  MissingInvalidParamsError,
  NotFoundError,
} from '../../shared/errors';
import { ErrorMiddleware } from '../ErrorMiddleware';

const makeSut = (): {
  sut: IErrorMiddleware;
  loggerManagerStub: jest.Mocked<ILogger>;
  reqStub: jest.Mocked<Request>;
  resStub: jest.Mocked<Response>;
  nextSpy: jest.Mock;
} => {
  const reqStub: jest.Mocked<Request> = {} as jest.Mocked<Request>;

  const resStub: jest.Mocked<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<Response>;

  const nextSpy = jest.fn();
  const loggerManagerStub = makeLoggerManagerStub();
  const sut = new ErrorMiddleware(loggerManagerStub);

  return { sut, loggerManagerStub, reqStub, resStub, nextSpy };
};

describe(ErrorMiddleware.name, () => {
  describe(ErrorMiddleware.prototype.notFoundMiddleware.name, () => {
    it('should call next function with a not found error', async () => {
      const { sut, reqStub, resStub, nextSpy } = makeSut();

      sut.notFoundMiddleware(reqStub, resStub, nextSpy);

      expect(nextSpy).toHaveBeenCalledWith(new NotFoundError());
    });
  });

  describe(ErrorMiddleware.prototype.handleErrorMiddleware.name, () => {
    it('should call complete logger when the error is trusted', () => {
      const { sut, loggerManagerStub, reqStub, resStub, nextSpy } = makeSut();

      sut.handleErrorMiddleware(new NotFoundError(), reqStub, resStub, nextSpy);
      expect(loggerManagerStub.error).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'GENERIC_ERROR',
          msg: 'Request Not Found',
        }),
      );
      expect(nextSpy).toHaveBeenCalledWith(new NotFoundError());
    });

    it('should call complete logger when the error is trusted', () => {
      const { sut, loggerManagerStub, reqStub, resStub, nextSpy } = makeSut();

      sut.handleErrorMiddleware(
        new NotFoundError(''),
        reqStub,
        resStub,
        nextSpy,
      );
      expect(loggerManagerStub.error).toHaveBeenCalledWith(
        expect.objectContaining({
          msg: 'Request Not Found',
        }),
      );
      expect(nextSpy).toHaveBeenCalledWith(new NotFoundError(''));
    });

    it('should call partial logger when the error is not trusted', () => {
      const { sut, loggerManagerStub, reqStub, resStub, nextSpy } = makeSut();
      const error = new Error('unexpected error') as GenericAppError;
      sut.handleErrorMiddleware(error, reqStub, resStub, nextSpy);
      expect(loggerManagerStub.error).toHaveBeenCalledWith(
        expect.objectContaining({
          msg: 'unexpected error',
        }),
      );
      expect(nextSpy).toHaveBeenCalledWith(error);
    });
  });

  describe(ErrorMiddleware.prototype.sendErrorMiddleware.name, () => {
    it('should return call json method with the complete error object when the error is trusted', () => {
      const { sut, reqStub, resStub, nextSpy } = makeSut();

      sut.sendErrorMiddleware(
        new MissingInvalidParamsError(),
        reqStub,
        resStub,
        nextSpy,
      );

      expect(resStub.json).toHaveBeenCalledWith({
        code: 'GENERIC_ERROR',
        description: 'Missing or invalid param',
        statusCode: 400,
        statusCodeAsString: 'BAD_REQUEST',
        validationErrors: [],
      });
    });

    it('should return call json method with the partial error object when the error is not trusted', () => {
      const { sut, reqStub, resStub, nextSpy } = makeSut();

      sut.sendErrorMiddleware(
        new Error('unexpected error') as GenericAppError,
        reqStub,
        resStub,
        nextSpy,
      );

      expect(resStub.json).toHaveBeenCalledWith({
        code: 'GENERIC_ERROR',
        description: 'Internal Server Error',
        statusCode: 500,
        statusCodeAsString: 'INTERNAL_SERVER_ERROR',
      });
    });
  });
});
