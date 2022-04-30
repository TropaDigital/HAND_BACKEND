import { UserService } from '../../../src/modules/user/service';
import { makeInternalErrorResponse } from '../../helpers';
import { getFakeToken, populateDatabase } from '../helpers/testHelper';

describe('GET /users - Get all users', () => {
  let token: string;

  beforeAll(async () => {
    await global.prismaClient.user.deleteMany();
    await populateDatabase();
    token = await getFakeToken();
  });

  afterAll(async () => {
    await global.prismaClient.user.deleteMany();
  });

  it('Should return 200 and all users', async () => {
    const response = await global.testRequest
      .get('/users')
      .set({ 'x-access-token': token });

    expect(response.body.data).toEqual([
      {
        email: 'joao@mail.com',
        id: 1,
        name: 'João',
        role: 'USER',
        status: 'ACTIVE',
        userName: 'joao',
      },
      {
        email: 'pedro@mail.com',
        id: 2,
        name: 'Pedro',
        role: 'USER',
        status: 'ACTIVE',
        userName: 'pedro',
      },
    ]);
    expect(response.status).toBe(200);
  });

  it('Should return 200 and empty array when there is no user', async () => {
    await global.prismaClient.user.deleteMany();

    const response = await global.testRequest
      .get('/users')
      .set({ 'x-access-token': token });

    expect(response.body.data).toEqual([]);
    expect(response.status).toBe(200);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    jest
      .spyOn(UserService.prototype, 'getAll')
      .mockRejectedValueOnce(new Error('getAll unexpected error'));

    const response = await global.testRequest
      .get(`/users`)
      .set({ 'x-access-token': token });
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
