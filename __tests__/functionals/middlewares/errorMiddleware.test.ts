/* eslint-disable max-nested-callbacks */
import { HealthcheckController } from '../../../src/modules/healthcheck/controller';
import { NotFoundError } from '../../../src/shared/errors';
import { makeNotFoundResponse } from '../../helpers';

describe('Global Error Middleware', () => {
  describe('GET /route-that-does-not-exists', () => {
    it('should return an not found object', async () => {
      const response = await global.testRequest.get(
        '/route-that-does-not-exists',
      );

      const expectedResult = makeNotFoundResponse();
      expect(response.body).toEqual(expectedResult);
      expect(response.status).toBe(expectedResult.statusCode);
    });
  });

  describe('GET /healthcheck', () => {
    it('should return an not found object', async () => {
      jest
        .spyOn(HealthcheckController.prototype, 'getApplicationStatus')
        .mockRejectedValueOnce(new NotFoundError(''));
      const response = await global.testRequest.get('/healthcheck');

      const expectedResult = makeNotFoundResponse('');
      expect(response.body).toEqual(expectedResult);
      expect(response.status).toBe(expectedResult.statusCode);
    });
  });
});
