import { ConsultantService } from '../../../src/modules/consultant/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
} from '../helpers';
import { populateDatabase as populateUsersDatabase } from '../users/helpers';
import { populateDatabase } from './helpers';

describe('PATCH /consultants/{id} - Update consultant by id', () => {
  const token = new AuthenticationService().generateToken({
    sub: 'User',
    role: 'VALID_ROLE',
  });

  beforeAll(async () => {
    await populateUsersDatabase();
    await global.prismaClient.consultant.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.consultant.deleteMany();
  });

  it('Should return 204 with updated', async () => {
    const id = 1;

    const response = await global.testRequest
      .patch(`/consultants/${id}`)
      .set('x-access-token', token)
      .send({
        name: 'Vinicius',
        city: 'Fortaleza',
        taxId: '784541231',
        state: 'Ceará',
        createdBy: 'Pedro',
      });

    expect(response.body).toEqual({});
    expect(response.status).toBe(204);
  });

  it('Should return 404 when consultant does not exists', async () => {
    const id = 10;
    const response = await global.testRequest
      .patch(`/consultants/${id}`)
      .set('x-access-token', token)
      .send({
        name: 'Vinicius',
        city: 'Fortaleza',
        taxId: '784541231',
        state: 'Ceará',
        createdBy: 'Pedro',
      });
    expect(response.body).toEqual(
      makeNotFoundResponse('consultant not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const id = 0;
    const response = await global.testRequest
      .patch(`/consultants/${id}`)
      .set('x-access-token', token)
      .send({
        name: 1,
        taxId: 1,
        city: 1,
        state: 1,
        commission: 'dois',
        createdBy: 1,
      });

    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'id',
        friendlyFieldName: 'id',
        message: '"id" must be greater than or equal to 1',
      },
      {
        fieldName: 'name',
        friendlyFieldName: 'name',
        message: '"name" must be a string',
      },
      {
        fieldName: 'taxId',
        friendlyFieldName: 'taxId',
        message: '"taxId" must be a string',
      },
      {
        fieldName: 'city',
        friendlyFieldName: 'city',
        message: '"city" must be a string',
      },
      {
        fieldName: 'state',
        friendlyFieldName: 'state',
        message: '"state" must be a string',
      },
      {
        fieldName: 'commission',
        friendlyFieldName: 'commission',
        message: '"commission" must be a number',
      },
      {
        fieldName: 'createdBy',
        friendlyFieldName: 'createdBy',
        message: '"createdBy" must be a string',
      },
    ]);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('Should return 204 when receive just one param', async () => {
    const id = 1;

    const response = await global.testRequest
      .patch(`/consultants/${id}`)
      .set('x-access-token', token)
      .send({
        name: 'João',
      });
    expect(response.body).toEqual({});
    expect(response.status).toBe(204);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const id = 1;
    jest
      .spyOn(ConsultantService.prototype, 'updateById')
      .mockRejectedValueOnce(new Error('updateById unexpected error'));

    const response = await global.testRequest
      .patch(`/consultants/${id}`)
      .set('x-access-token', token)
      .send({
        name: 'João',
      });
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
