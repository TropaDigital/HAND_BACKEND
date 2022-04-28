import { UserService } from '../../../src/modules/user/service';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
} from '../../helpers';
import { populateDatabase } from '../helpers/testHelper';

describe('GET /users/{userName} - Get user by email', () => {
  beforeAll(async () => {
    await global.prismaClient.user.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.user.deleteMany();
  });

  it('Should return 200 with user', async () => {
    const userName = 'joao';

    const response = await global.testRequest.get(`/users/${userName}`);
    expect(response.body.data).toEqual({
      email: 'joao@mail.com',
      userName: 'joao',
      id: 1,
      name: 'João',
      role: 'USER',
      status: 'ACTIVE',
    });
    expect(response.status).toBe(200);
  });

  it('Should return 404 and empty array when there is no user', async () => {
    await global.prismaClient.user.deleteMany();
    const userName = 'notfounduser';
    const response = await global.testRequest.get(`/users/${userName}`);
    expect(response.body).toEqual(
      makeNotFoundResponse('user not found with provided userName'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const userName = 2;
    const response = await global.testRequest.get(`/users/${userName}`);

    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'userName',
        friendlyFieldName: 'userName',
        message: '"userName" length must be at least 3 characters long',
      },
    ]);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const userName = 'joao';
    jest
      .spyOn(UserService.prototype, 'getByUserName')
      .mockRejectedValueOnce(new Error('getByUserName unexpected error'));

    const response = await global.testRequest.get(`/users/${userName}`);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
