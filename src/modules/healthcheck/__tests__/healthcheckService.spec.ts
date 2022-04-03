import { name } from '../../../../package.json';
import MySqlDBClient from '../../../infra/mySql';
import { IDatabaseConnection } from '../../../interfaces/infra/IDatabaseConnection';
import { HealthcheckService } from '../service';

const makeMySqlClientStub = (): jest.Mocked<IDatabaseConnection> => {
  return {
    getConnectionStatus: jest.fn().mockResolvedValue('connected'),
    closeConnection: jest.fn(),
    startConnection: jest.fn(),
  };
};

const makeSut = (): {
  sut: HealthcheckService;
  mySqlClientStub: jest.Mocked<IDatabaseConnection>;
} => {
  const mySqlClientStub = makeMySqlClientStub();
  const sut = new HealthcheckService(mySqlClientStub);
  return {
    sut,
    mySqlClientStub,
  };
};

describe(HealthcheckService.name, () => {
  describe(HealthcheckService.prototype.getApplicationStatus.name, () => {
    it('should call the get connection status correctly', async () => {
      jest
        .spyOn(MySqlDBClient.prototype, 'startConnection')
        .mockResolvedValueOnce();
      const connectionStatusSpy = jest
        .spyOn(MySqlDBClient.prototype, 'getConnectionStatus')
        .mockResolvedValueOnce('connected');
      const sut = new HealthcheckService();
      await sut.getApplicationStatus();
      expect(connectionStatusSpy).toHaveBeenCalled();
    });

    it('should return that the application is healthly when all the resources is healthly', async () => {
      const { sut } = makeSut();
      const result = await sut.getApplicationStatus();
      expect(result).toEqual(
        expect.objectContaining({
          name,
          database: {
            connectionStatus: 'connected',
            status: 'healthly',
          },
          status: 'healthly',
        }),
      );
    });

    it('should return that the application is not healthly when one of the resources is not healthly', async () => {
      const { sut, mySqlClientStub } = makeSut();
      mySqlClientStub.getConnectionStatus.mockResolvedValueOnce('disconnected');
      const result = await sut.getApplicationStatus();
      expect(result).toEqual(
        expect.objectContaining({
          name,
          database: {
            connectionStatus: 'disconnected',
            status: 'unhealthy',
          },
          status: 'unhealthy',
        }),
      );
    });

    it('should return that the application is not healthly when database connection status check throw an exception', async () => {
      const { sut, mySqlClientStub } = makeSut();
      mySqlClientStub.getConnectionStatus.mockRejectedValueOnce(
        new Error('unexpected get connection status error'),
      );
      const result = await sut.getApplicationStatus();
      expect(result).toEqual(
        expect.objectContaining({
          name,
          database: {
            connectionStatus: 'disconnected',
            status: 'unhealthy',
          },
          status: 'unhealthy',
        }),
      );
    });

    it('should return that the application is not healthly when database connection status check return a nullable value', async () => {
      const { sut, mySqlClientStub } = makeSut();
      mySqlClientStub.getConnectionStatus.mockResolvedValueOnce('');
      const result = await sut.getApplicationStatus();
      expect(result).toEqual(
        expect.objectContaining({
          name,
          database: {
            connectionStatus: 'disconnected',
            status: 'unhealthy',
          },
          status: 'unhealthy',
        }),
      );
    });
  });
});
