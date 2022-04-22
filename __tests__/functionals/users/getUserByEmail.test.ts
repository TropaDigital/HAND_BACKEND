import { UserService } from '../../../src/modules/user/service';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
} from '../../helpers';
import {
  makeFakeCreateUserParams,
  populateDatabase,
} from './helpers/testHelper';

describe('GET /users/{email} - Get user by email', () => {
  beforeAll(async () => {
    await global.prismaClient.user.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.user.deleteMany();
  });

  it('Should return 200 with user', async () => {
    const email = 1;

    const response = await global.testRequest.get(`/users/${email}`);
    expect(response.body.data).toEqual(
      expect.objectContaining(makeFakeCreateUserParams({ name: 'João' })),
    );
    expect(response.status).toBe(200);
  });

  it('Should return 404 and empty array when there is no user', async () => {
    await global.prismaClient.user.deleteMany();
    const email = 10;
    const response = await global.testRequest.get(`/users/${email}`);
    expect(response.body).toEqual(
      makeNotFoundResponse('user not found with provided email'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const email = 0;
    const response = await global.testRequest.get(`/users/${email}`);

    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'email',
        friendlyFieldName: 'email',
        message: '"email" must be greater than or equal to 1',
      },
    ]);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const email = 1;
    jest
      .spyOn(UserService.prototype, 'getByEmail')
      .mockRejectedValueOnce(new Error('getByEmail unexpected error'));

    const response = await global.testRequest.get(`/users/${email}`);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
