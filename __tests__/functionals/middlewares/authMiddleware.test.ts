/* eslint-disable max-nested-callbacks */

import { StatusCodes } from 'http-status-codes';
import { TokenExpiredError } from 'jsonwebtoken';

import ErrorCodes from '../../../src/enums/ErrorCodes';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import { makeUnauthorizedResponse } from '../helpers';

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

      const expectedResult = makeUnauthorizedResponse(
        'token not provided',
        ErrorCodes.AUTH_ERROR_001,
      );
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

      expect(response.body).toEqual({
        code: 'GENERIC_ERROR',
        description: 'Internal Server Error',
        statusCode: 500,
        statusCodeAsString: 'INTERNAL_SERVER_ERROR',
      });
      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
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
