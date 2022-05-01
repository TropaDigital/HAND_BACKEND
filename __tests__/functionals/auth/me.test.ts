import { getFakeToken, populateDatabase } from '../helpers';

describe('POST /users/me - Get User Info', () => {
  let token: string;
  beforeAll(async () => {
    await global.prismaClient.user.deleteMany();
    await populateDatabase();
    token = await getFakeToken();
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
    expect(response.status).toBe(200);
  });

  it('Should return 401 when token is invalid', async () => {
    const response = await global.testRequest
      .get(`/auth/me`)
      .send()
      .set({ 'x-access-token': 'invalid token' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      code: 'GENERIC_ERROR',
      description: 'jwt malformed',
      statusCode: 401,
      statusCodeAsString: 'UNAUTHORIZED',
      validationErrors: [],
    });
  });

  afterAll(async () => {
    await global.prismaClient.user.deleteMany();
  });
});
