import { populateDatabase } from '../users/helpers';
import { makeFakeLoginParams } from './helpers';

describe('GET /auth/token - Authenticate User', () => {
  beforeAll(async () => {
    await global.prismaClient.user.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.user.deleteMany();
  });

  it('Should return 200 when login and password is correct', async () => {
    const params = makeFakeLoginParams();

    const response = await global.testRequest.post(`/auth/token`).send(params);

    expect(response.body.data).toEqual(
      expect.objectContaining({
        user: {
          id: 1,
          name: 'João',
          role: 'USER',
          status: 'ACTIVE',
          userName: 'joao',
          email: 'joao@mail.com',
        },
        token: expect.any(String),
      }),
    );
    expect(response.status).toBe(200);
  });

  it('Should return 401 when login does not exists', async () => {
    const params = makeFakeLoginParams({ login: 'invalid@mail.com' });

    const response = await global.testRequest.post(`/auth/token`).send(params);

    expect(JSON.parse(response.text)).toEqual({
      code: 'INVALID_CREDENTIALS',
      description: 'invalid credentials',
      statusCode: 401,
      statusCodeAsString: 'UNAUTHORIZED',
      validationErrors: [],
    });
    expect(response.status).toBe(401);
  });

  it('Should return 401 when credentials are incorrect', async () => {
    const params = makeFakeLoginParams({
      password: 'wrong-password',
    });

    const response = await global.testRequest.post(`/auth/token`).send(params);

    expect(JSON.parse(response.text)).toEqual({
      code: 'INVALID_CREDENTIALS',
      description: 'invalid credentials',
      statusCode: 401,
      statusCodeAsString: 'UNAUTHORIZED',
      validationErrors: [],
    });
    expect(response.status).toBe(401);
  });
});
