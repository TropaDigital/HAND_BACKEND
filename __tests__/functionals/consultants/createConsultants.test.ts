import { ConsultantService } from '../../../src/modules/consultant/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
} from '../helpers';
import { populateDatabase } from '../users/helpers';
import { makeFakeCreateConsultantParams } from './helpers';

describe('POST /consultants - Create new consultant', () => {
  const token = new AuthenticationService().generateToken({
    sub: 'User',
    role: 'VALID_ROLE',
  });

  beforeAll(async () => {
    await global.prismaClient.consultant.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.consultant.deleteMany();
  });

  it('Should return 201 with created consultant', async () => {
    const params = makeFakeCreateConsultantParams();

    const response = await global.testRequest
      .post(`/consultants`)
      .set('x-access-token', token)
      .send(params);

    expect(response.body.data).toEqual(expect.objectContaining(params));
    expect(response.status).toBe(201);
  });

  it('Should return 400 when receive invalid params', async () => {
    const params = {
      name: 'Vinicius',
      city: 'Fortaleza',
      taxId: '784541231',
    };

    const response = await global.testRequest
      .post(`/consultants`)
      .set('x-access-token', token)
      .send(params);
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
    const params = makeFakeCreateConsultantParams();
    jest
      .spyOn(ConsultantService.prototype, 'create')
      .mockRejectedValueOnce(new Error('create unexpected error'));
    const response = await global.testRequest
      .post(`/consultants`)
      .set('x-access-token', token)
      .send(params);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
