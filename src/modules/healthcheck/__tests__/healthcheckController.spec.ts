import { name } from '../../../../package.json';
import { HealthcheckController } from '../controller';
import { IHealthcheckService } from '../interfaces';
import { HealthcheckService } from '../service';

const makeSut = (): {
  sut: HealthcheckController;
  healthcheckServiceStub: jest.Mocked<IHealthcheckService>;
} => {
  const healthcheckServiceStub: jest.Mocked<IHealthcheckService> = {
    getApplicationStatus: jest.fn().mockResolvedValue({
      name,
      uptime: '20 secs',
      version: '1.0.0',
      status: 'healthly',
      database: {
        status: 'healthly',
        connectionStatus: 'connected',
      },
    }),
  };
  const sut = new HealthcheckController(healthcheckServiceStub);

  return { sut, healthcheckServiceStub };
};

describe(HealthcheckController.name, () => {
  describe(HealthcheckController.prototype.getApplicationStatus.name, () => {
    it('should return that the application is healthly when all the resources is healthly', async () => {
      const { sut } = makeSut();
      const result = await sut.getApplicationStatus();
      expect(result).toEqual({
        body: expect.objectContaining({
          name,
          database: {
            connectionStatus: 'connected',
            status: 'healthly',
          },
          status: 'healthly',
        }),
        statusCodeAsString: 'OK',
      });
    });

    it('should return that the application is not healthly when one of the resources is not healthly', async () => {
      const { sut, healthcheckServiceStub } = makeSut();
      healthcheckServiceStub.getApplicationStatus.mockResolvedValueOnce({
        name,
        uptime: '20 secs',
        version: '1.0.0',
        status: 'unhealthy',
        database: {
          status: 'unhealthy',
          connectionStatus: 'disconnected',
        },
      });
      const result = await sut.getApplicationStatus();
      expect(result).toEqual({
        body: expect.objectContaining({
          name,
          database: {
            connectionStatus: 'disconnected',
            status: 'unhealthy',
          },
          status: 'unhealthy',
        }),
        statusCodeAsString: 'INTERNAL_SERVER_ERROR',
      });
    });

    it('should return that the application is not healthly when one of the resources is not healthly', async () => {
      const getApplicationStatusSpy = jest
        .spyOn(HealthcheckService.prototype, 'getApplicationStatus')
        .mockResolvedValueOnce({
          name,
          uptime: '20 secs',
          version: '1.0.0',
          status: 'unhealthy',
          database: {
            status: 'unhealthy',
            connectionStatus: 'disconnected',
          },
        });
      const sut = new HealthcheckController();
      await sut.getApplicationStatus();
      expect(getApplicationStatusSpy).toHaveBeenCalled();
    });
  });
});
