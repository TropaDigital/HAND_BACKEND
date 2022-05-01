import { UserService } from '../../../src/modules/user/service';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
} from '../../helpers';
import { getFakeToken, populateDatabase } from '../helpers/testHelper';

describe('DELETE /users/{id} - Delete user by id', () => {
  let token: string;
  beforeAll(async () => {
    await global.prismaClient.user.deleteMany();
    await populateDatabase();
    token = await getFakeToken();
  });

  afterAll(async () => {
    await global.prismaClient.user.deleteMany();
  });

  it('Should return 204 when the user is deleted', async () => {
    const id = 1;

    const response = await global.testRequest
      .delete(`/users/${id}`)
      .set({ 'x-access-token': token });

    expect(response.body).toEqual({});
    expect(response.status).toBe(204);
  });

  it('Should return 404 when user does not exists', async () => {
    const id = 10;
    const response = await global.testRequest
      .delete(`/users/${id}`)
      .set({ 'x-access-token': token });

    expect(response.body).toEqual(
      makeNotFoundResponse('user not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const id = 0;
    const response = await global.testRequest
      .delete(`/users/${id}`)
      .set({ 'x-access-token': token });

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
      .spyOn(UserService.prototype, 'deleteById')
      .mockRejectedValueOnce(new Error('deleteById unexpected error'));

    const response = await global.testRequest
      .delete(`/users/${id}`)
      .set({ 'x-access-token': token });
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});