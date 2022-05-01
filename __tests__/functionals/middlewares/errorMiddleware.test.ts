/* eslint-disable max-nested-callbacks */
import { HealthcheckController } from '../../../src/modules/healthcheck/controller';
import { NotFoundError } from '../../../src/shared/errors';
import { makeFakeLoginParams } from '../auth/helpers';
import { makeNotFoundResponse } from '../helpers';
import { populateDatabase } from '../users/helpers';

describe('Global Error Middleware', () => {
  describe('GET /route-that-does-not-exists', () => {
    it('should return an not found object', async () => {
      await populateDatabase();
      const params = makeFakeLoginParams();
      const authResponse = await global.testRequest
        .post(`/auth/token`)
        .send(params);
      const token = authResponse?.body?.data?.token;

      const response = await global.testRequest
        .get('/route-that-does-not-exists')
        .set({ 'x-access-token': token });

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
