/* eslint-disable max-nested-callbacks */

import { TokenExpiredError } from 'jsonwebtoken';

import { AuthenticationService } from '../../../src/shared/auth/auth';
import { makeUnauthorizedResponse } from '../../helpers';

describe('Auth middleware', () => {
  const token = new AuthenticationService().generateToken({
    sub: 1,
    role: 'VALID_ROLE',
  });

  describe('GET /authenticated-route', () => {
    it('should return an unauthorized error when not provide an access token', async () => {
      const response = await global.testRequest.post(
        '/loansimulations/simulate',
      );

      const expectedResult = makeUnauthorizedResponse('token not provided');
      expect(response.body).toEqual(expectedResult);
      expect(response.status).toBe(expectedResult.statusCode);
    });

    it('should return an unauthorized error when the auth service throws an error', async () => {
      jest
        .spyOn(AuthenticationService.prototype, 'decodeToken')
        .mockImplementationOnce(() => {
          throw new Error('unexpected auth service decode token error');
        });
      const response = await global.testRequest
        .post('/loansimulations/simulate')
        .set('x-access-token', token);

      const expectedResult = makeUnauthorizedResponse('User not authenticated');
      expect(response.body).toEqual(expectedResult);
      expect(response.status).toBe(expectedResult.statusCode);
    });

    it('should return an unauthorized error when the auth service throws an json web token error', async () => {
      jest
        .spyOn(AuthenticationService.prototype, 'decodeToken')
        .mockImplementationOnce(() => {
          throw new TokenExpiredError('jwt expired', new Date());
        });
      const response = await global.testRequest
        .post('/loansimulations/simulate')
        .set('x-access-token', token);

      const expectedResult = makeUnauthorizedResponse('jwt expired');
      expect(response.body).toEqual(expectedResult);
      expect(response.status).toBe(expectedResult.statusCode);
    });
  });
});
