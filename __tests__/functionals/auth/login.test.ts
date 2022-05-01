import { populateDatabase } from '../helpers';
import { makeFakeLoginParams } from './helpers/testHelper';

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

  it('Should return 401 when login is incorrect', async () => {
    const params = makeFakeLoginParams({ login: 'invalid@mail.com' });

    const response = await global.testRequest.post(`/auth/token`).send(params);

    expect(JSON.parse(response.text)).toEqual(
      expect.objectContaining({
        description: 'User does not exist in database',
      }),
    );
    expect(response.status).toBe(401);
  });

  it('Should return 401 when password is incorrect', async () => {
    const params = makeFakeLoginParams({ password: 'incorrect password' });

    const response = await global.testRequest.post(`/auth/token`).send(params);

    expect(response.body).toEqual(
      expect.objectContaining({ description: 'Invalid Password' }),
    );
    expect(response.status).toBe(401);
  });
});
