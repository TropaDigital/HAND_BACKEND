import { AssociatedService } from '../../../src/modules/associated/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
} from '../helpers';
import { populateDatabase as populateUsersDatabase } from '../users/helpers';
import { populateDatabase } from './helpers';

describe('PATCH /associateds/{id} - Update associated by id', () => {
  const token = new AuthenticationService().generateToken({
    sub: 'Any User',
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

  it('Should return 204 with updated', async () => {
    const id = 1;

    const response = await global.testRequest
      .patch(`/associateds/${id}`)
      .set('x-access-token', token)
      .send({
        name: 'Any name',
      });

    expect(response.body).toEqual({});
    expect(response.status).toBe(204);
  });

  it('Should return 404 when associated does not exists', async () => {
    const id = 10;
    const response = await global.testRequest
      .patch(`/associateds/${id}`)
      .set('x-access-token', token)
      .send({
        name: 'Vinicius',
      });
    expect(response.body).toEqual(
      makeNotFoundResponse('associated not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const id = 1;
    const response = await global.testRequest
      .patch(`/associateds/${id}`)
      .set('x-access-token', token)
      .send({
        associated: 1,
        bank: 1,
        consultant: 1,
        contractModel: 1,
        financialAssistanceValue: '20',
        installmentNumber: '6',
        installmentValue: '20',
        publicAgency: 1,
        initialDate: 1,
        createdBy: 1,
      });

    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'publicAgency',
        friendlyFieldName: 'órgão público',
        message: '"órgão público" must be a string',
      },
      {
        fieldName: 'bank',
        friendlyFieldName: 'banco',
        message: '"banco" must be a string',
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
      .patch(`/associateds/${id}`)
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
      .spyOn(AssociatedService.prototype, 'updateById')
      .mockRejectedValueOnce(new Error('updateById unexpected error'));

    const response = await global.testRequest
      .patch(`/associateds/${id}`)
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