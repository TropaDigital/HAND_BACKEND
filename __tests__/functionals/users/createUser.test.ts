import { UserService } from '../../../src/modules/user/service';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
} from '../../helpers';
import { makeFakeCreateUserParams } from './helpers/testHelper';

describe('POST /users - Create new user', () => {
  beforeAll(async () => {
    await global.prismaClient.user.deleteMany();
  });

  afterAll(async () => {
    await global.prismaClient.user.deleteMany();
  });

  it('Should return 201 with created user', async () => {
    const params = makeFakeCreateUserParams();

    const response = await global.testRequest.post(`/users`).send(params);

    expect(response.body.data).toEqual(expect.objectContaining(params));
    expect(response.status).toBe(201);
  });

  it('Should return 400 when receive invalid params', async () => {
    const params = {
      name: 'Vinicius',
      city: 'Fortaleza',
      taxId: '784541231',
    };

    const response = await global.testRequest.post(`/users`).send(params);
    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'state',
        friendlyFieldName: 'state',
        message: '"state" is required',
      },
      {
        fieldName: 'createdBy',
        friendlyFieldName: 'createdBy',
        message: '"createdBy" is required',
      },
    ]);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const params = makeFakeCreateUserParams();
    jest
      .spyOn(UserService.prototype, 'create')
      .mockRejectedValueOnce(new Error('create unexpected error'));
    const response = await global.testRequest.post(`/users`).send(params);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
