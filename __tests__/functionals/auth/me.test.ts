import { StatusCodes } from 'http-status-codes';

import { UserService } from '../../../src/modules/user/service';
import { makeNotFoundResponse, getFakeToken } from '../helpers';
import { populateDatabase } from '../users/helpers';

describe('POST /users/me - Get User Info', () => {
  let token: string;
  beforeAll(async () => {
    await global.prismaClient.user.deleteMany();
    await populateDatabase();
    token = await getFakeToken();
  });

  afterAll(async () => {
    await global.prismaClient.user.deleteMany();
  });

  it('Should return 200 with the logged user when success', async () => {
    const response = await global.testRequest
      .get(`/auth/me`)
      .send()
      .set({ 'x-access-token': token });

    expect(response.body.data).toEqual({
      email: 'joao@mail.com',
      id: expect.any(Number),
      name: 'João',
      role: 'USER',
      status: 'ACTIVE',
      userName: 'joao',
    });
    expect(response.status).toBe(StatusCodes.OK);
  });

  it('Should return 404 when the user is not authenticated', async () => {
    jest
      .spyOn(UserService.prototype, 'getByUserName')
      .mockResolvedValueOnce(null);
    const response = await global.testRequest
      .get(`/auth/me`)
      .send()
      .set({ 'x-access-token': token });

    const expectedResponse = makeNotFoundResponse('User not found');
    expect(response.body).toEqual(expectedResponse);
    expect(response.status).toBe(expectedResponse.statusCode);
  });

  it('Should return 401 when token is invalid', async () => {
    const response = await global.testRequest
      .get(`/auth/me`)
      .send()
      .set({ 'x-access-token': 'invalid token' });

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body).toEqual({
      code: 'GENERIC_ERROR',
      description: 'jwt malformed',
      statusCode: 401,
      statusCodeAsString: 'UNAUTHORIZED',
      validationErrors: [],
    });
  });
});
