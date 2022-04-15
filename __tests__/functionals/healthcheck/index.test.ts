import { StatusCodes } from 'http-status-codes';

import { name, version } from '../../../package.json';
import MySqlDBClient from '../../../src/infra/mySql';
import { IFormatedApiHttpResponse } from '../../../src/interfaces/http';

describe('GET /healthcheck - Get application stats', () => {
  it('should return that the application status is healthly', async () => {
    const response = await global.testRequest.get('/healthcheck');

    const expectedResult: IFormatedApiHttpResponse = {
      statusCodeAsString: 'OK',
      statusCode: StatusCodes.OK,
      data: {
        database: {
          connectionStatus: 'connected',
          status: 'healthly',
        },
        name,
        version,
        status: 'healthly',
      },
    };
    expect(response.status).toBe(expectedResult.statusCode);
    expect(response.body).toEqual({
      ...expectedResult,
      data: expect.objectContaining(expectedResult.data),
    });
  });

  it('should return that the application status is not healthly when database return status diferent of connected', async () => {
    jest
      .spyOn(MySqlDBClient.prototype, 'getConnectionStatus')
      .mockResolvedValueOnce('' as any);
    const response = await global.testRequest.get('/healthcheck');

    const expectedResult: IFormatedApiHttpResponse = {
      statusCodeAsString: 'INTERNAL_SERVER_ERROR',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      data: {
        name,
        version,
        status: 'unhealthy',
        database: {
          connectionStatus: 'disconnected',
          status: 'unhealthy',
        },
      },
    };
    expect(response.status).toBe(expectedResult.statusCode);
    expect(response.body).toEqual({
      ...expectedResult,
      data: expect.objectContaining(expectedResult.data),
    });
  });

  it('should return that the application status is not healthly when database throws an exception', async () => {
    jest
      .spyOn(MySqlDBClient.prototype, 'getConnectionStatus')
      .mockRejectedValueOnce(new Error('getConnectionStatus unexpected error'));
    const response = await global.testRequest.get('/healthcheck');

    const expectedResult: IFormatedApiHttpResponse = {
      statusCodeAsString: 'INTERNAL_SERVER_ERROR',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      data: {
        name,
        version,
        status: 'unhealthy',
        database: {
          connectionStatus: 'disconnected',
          status: 'unhealthy',
        },
      },
    };
    expect(response.status).toBe(expectedResult.statusCode);
    expect(response.body).toEqual({
      ...expectedResult,
      data: expect.objectContaining(expectedResult.data),
    });
  });
});
