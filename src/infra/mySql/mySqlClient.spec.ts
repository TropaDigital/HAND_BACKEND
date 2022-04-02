import { PrismaClient } from '@prisma/client';

import MySqlDBClient from '.';
import { Logger } from '../../interfaces/logger/Logger';

jest.mock('@prisma/client');

export const prismaClientMockFactory = (): jest.Mocked<PrismaClient> => {
  return {
    $connect: jest.fn(),
    $queryRaw: jest.fn(),
    $disconnect: jest.fn(),
  } as unknown as jest.Mocked<PrismaClient>;
};

export const makeLoggerManagerStub = (): jest.Mocked<Logger> => {
  const loggerManagerStub: jest.Mocked<Logger> = {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };

  return loggerManagerStub;
};

const makeSut = (): {
  sut: MySqlDBClient;
  loggerManagerStub: jest.Mocked<Logger>;
  prismaClientMock: jest.Mocked<PrismaClient>;
} => {
  const prismaClientMock = prismaClientMockFactory();
  const loggerManagerStub = makeLoggerManagerStub();
  const sut = MySqlDBClient.getInstance(loggerManagerStub, prismaClientMock);
  return {
    sut,
    prismaClientMock:
      sut.getPrismaClientInstance() as jest.Mocked<PrismaClient>,
    loggerManagerStub,
  };
};

describe(MySqlDBClient.name, () => {
  describe(MySqlDBClient.prototype.startConnection.name, () => {
    it('should call the prisma $connect method', async () => {
      const { sut, prismaClientMock } = makeSut();
      await sut.startConnection();
      expect(prismaClientMock.$connect).toHaveBeenCalled();
    });

    it('should not call the prisma $connect method when is already connected', async () => {
      const { sut, prismaClientMock } = makeSut();
      jest.spyOn(sut, 'getConnectionStatus').mockResolvedValueOnce('connected');
      await sut.startConnection();
      expect(prismaClientMock.$connect).not.toHaveBeenCalled();
    });

    it('should throw when the connection throws an exception', async () => {
      const { sut, prismaClientMock } = makeSut();
      prismaClientMock.$connect.mockRejectedValueOnce(
        new Error('unexpected error on connect'),
      );
      await expect(sut.startConnection()).rejects.toThrow(
        new Error('unexpected error on connect'),
      );
    });
  });

  describe(MySqlDBClient.getInstance.name, () => {
    it('should call the getInstance method with the default values', async () => {
      const getInstanceSpy = jest.spyOn(MySqlDBClient, 'getInstance');
      MySqlDBClient.getInstance();
      expect(getInstanceSpy).toHaveBeenCalledWith();
    });
  });

  describe(MySqlDBClient.prototype.closeConnection.name, () => {
    it('should call $disconnect method', async () => {
      const { sut, prismaClientMock } = makeSut();
      await sut.closeConnection();
      expect(prismaClientMock.$disconnect).toHaveBeenCalled();
    });
  });

  describe(MySqlDBClient.prototype.getConnectionStatus.name, () => {
    it('should call $queryRaw method', async () => {
      const { sut, prismaClientMock } = makeSut();
      prismaClientMock.$queryRaw.mockResolvedValueOnce('connected');
      const result = await sut.getConnectionStatus();
      expect(prismaClientMock.$queryRaw).toHaveBeenCalledWith([
        "show status like 'Conn%';",
      ]);
      expect(result).toEqual('connected');
    });
  });
});
