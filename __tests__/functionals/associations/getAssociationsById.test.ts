import { AssociatedService } from '../../../src/modules/associated/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
} from '../helpers';
import { populateDatabase as populateUsersDatabase } from '../users/helpers';
import { populateDatabase } from './helpers';

describe('GET /associateds/{id} - Get associated by id', () => {
  const token = new AuthenticationService().generateToken({
    sub: 'User',
    role: 'VALID_ROLE',
  });

  beforeAll(async () => {
    await populateUsersDatabase();
    await global.prismaClient.associated.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.associated.deleteMany();
  });

  it('Should return 200 with associated', async () => {
    const id = 1;

    const response = await global.testRequest
      .get(`/associateds/${id}`)
      .set('x-access-token', token);

    const result = response.body.data;
    expect(result.name).toEqual('João');
    expect(result.id).toEqual(1);
    expect(result.addresses.length).toBe(1);
    expect(response.status).toBe(200);
  });

  it('Should return 404 and empty array when there is no associated', async () => {
    await global.prismaClient.associated.deleteMany();
    const id = 10;
    const response = await global.testRequest
      .get(`/associateds/${id}`)
      .set('x-access-token', token);
    expect(response.body).toEqual(
      makeNotFoundResponse('associated not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const id = 0;
    const response = await global.testRequest
      .get(`/associateds/${id}`)
      .set('x-access-token', token);

    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'id',
        friendlyFieldName: 'id',
        message: '"id" must be greater than or equal to 1',
      },
    ]);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const id = 1;
    jest
      .spyOn(AssociatedService.prototype, 'getById')
      .mockRejectedValueOnce(new Error('getById unexpected error'));

    const response = await global.testRequest
      .get(`/associateds/${id}`)
      .set('x-access-token', token);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
