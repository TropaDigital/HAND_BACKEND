import { UserService } from '../../../src/modules/user/service';
import { makeInternalErrorResponse } from '../../helpers';
import { populateDatabase } from './helpers/testHelper';

describe('GET /users - Get all users', () => {
  beforeAll(async () => {
    await global.prismaClient.user.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.user.deleteMany();
  });

  it('Should return 200 and all users', async () => {
    const response = await global.testRequest.get('/users');

    expect(response.body.data).toEqual([
      {
        email: 'joao@mail.com',
        id: 1,
        name: 'João',
        role: 'DEFAULT',
        status: 'ACTIVE',
      },
      {
        email: 'pedro@mail.com',
        id: 2,
        name: 'Pedro',
        role: 'DEFAULT',
        status: 'ACTIVE',
      },
    ]);
    expect(response.status).toBe(200);
  });

  it('Should return 200 and empty array when there is no user', async () => {
    await global.prismaClient.user.deleteMany();

    const response = await global.testRequest.get('/users');

    expect(response.body.data).toEqual([]);
    expect(response.status).toBe(200);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    jest
      .spyOn(UserService.prototype, 'getAll')
      .mockRejectedValueOnce(new Error('getAll unexpected error'));

    const response = await global.testRequest.get(`/users`);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
