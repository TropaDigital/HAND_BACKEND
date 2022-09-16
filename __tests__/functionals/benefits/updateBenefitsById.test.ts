import { BenefitService } from '../../../src/modules/benefit/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import { populateDatabase as populateAssociatedDatabase } from '../associations/helpers';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
} from '../helpers';
import { populateDatabase as populateUsersDatabase } from '../users/helpers';
import { populateDatabase } from './helpers';

describe('PATCH /benefits/{id} - Update benefit by id', () => {
  const token = new AuthenticationService().generateToken({
    sub: 'User',
    role: 'VALID_ROLE',
  });

  beforeAll(async () => {
    await populateUsersDatabase();
    await populateAssociatedDatabase();
    await global.prismaClient.benefit.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.benefit.deleteMany();
  });

  it.skip('Should return 204 with updated', async () => {
    const id = 1;

    const response = await global.testRequest
      .patch(`/benefits/${id}`)
      .set('x-access-token', token)
      .send({
        name: 'Vinicius',
        city: 'Fortaleza',
        taxId: '784541231',
        state: 'Ceará',
        createdBy: 'Pedro',
        affiliation: 'any affiliation',
        associatedId: 1,
      });

    expect(response.body).toEqual({});
    expect(response.status).toBe(204);
  });

  it('Should return 404 when benefit does not exists', async () => {
    const id = 10;
    const response = await global.testRequest
      .patch(`/benefits/${id}`)
      .set('x-access-token', token)
      .send({
        name: 'Vinicius',
        city: 'Fortaleza',
        taxId: '784541231',
        state: 'Ceará',
        createdBy: 'Pedro',
        affiliation: 'any affiliation',
        associatedId: 1,
      });
    expect(response.body).toEqual(
      makeNotFoundResponse('benefit not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const id = 1;
    const response = await global.testRequest
      .patch(`/benefits/${id}`)
      .set('x-access-token', token)
      .send({
        associated: 1,
        association: 1,
        bank: 1,
        consultant: 1,
        contractModel: 1,
        financialAssistanceValue: '20',
        installmentNumber: '6',
        installmentValue: '20',
        publicAgency: 1,
        initialDate: 1,
        createdBy: 1,
        associatedId: 1,
        affiliation: 'Some Affiliation',
      });

    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'bank',
        friendlyFieldName: 'bank',
        message: '"bank" must be a string',
      },
      {
        fieldName: 'publicAgency',
        friendlyFieldName: 'publicAgency',
        message: '"publicAgency" must be a string',
      },
      {
        fieldName: 'contractModel',
        friendlyFieldName: 'contractModel',
        message: '"contractModel" must be a string',
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

  it.skip('Should return 204 when receive just one param', async () => {
    const id = 1;

    const response = await global.testRequest
      .patch(`/benefits/${id}`)
      .set('x-access-token', token)
      .send({
        salary: '2000',
        affiliation: 'any affiliation',
        associatedId: 1,
      });
    expect(response.body).toEqual({});
    expect(response.status).toBe(204);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const id = 1;
    jest
      .spyOn(BenefitService.prototype, 'updateById')
      .mockRejectedValueOnce(new Error('updateById unexpected error'));

    const response = await global.testRequest
      .patch(`/benefits/${id}`)
      .set('x-access-token', token)
      .send({
        salary: '2000',
        affiliation: 'any affiliation',
        associatedId: 1,
      });
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
