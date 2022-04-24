import { makeFakeLoginParams, populateDatabase } from './helpers/testHelper';

describe('GET /login - Authenticate User', () => {
  beforeAll(async () => {
    await global.prismaClient.user.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.user.deleteMany();
  });

  it('Should return 200 when login and password is correct', async () => {
    const params = makeFakeLoginParams();

    const response = await global.testRequest.post(`/login`).send(params);

    expect(response.body.data).toEqual(
      expect.objectContaining({
        email: 'joao@mail.com',
        token: expect.any(String),
      }),
    );
    expect(response.status).toBe(200);
  });

  it('Should return 401 when login is incorrect', async () => {
    const params = makeFakeLoginParams({ login: 'invalid@mail.com' });

    const response = await global.testRequest.post(`/login`).send(params);

    expect(JSON.parse(response.text)).toEqual(
      expect.objectContaining({ description: 'User not authenticated' }),
    );
    expect(response.status).toBe(401);
  });

  it('Should return 401 when password is incorrect', async () => {
    const params = makeFakeLoginParams({ password: 'incorrect password' });

    const response = await global.testRequest.post(`/login`).send(params);

    expect(response.body).toEqual(
      expect.objectContaining({ description: 'User not authenticated' }),
    );
    expect(response.status).toBe(401);
  });
});
