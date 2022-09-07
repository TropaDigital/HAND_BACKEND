import { AssociatedService } from '../../../src/modules/associated/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
} from '../helpers';
import { populateDatabase as populateUsersDatabase } from '../users/helpers';
import {
  makeFakeEmploymentRelationshipParams,
  populateDatabase,
} from './helpers';

describe.skip('PATCH /associateds/{id} - Update associated by id', () => {
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
    await global.prismaClient.address.deleteMany();
    await global.prismaClient.employmentRelationship.deleteMany();
  });

  it('Should return 200 with updated', async () => {
    const id = 1;

    const response = await global.testRequest
      .patch(`/associateds/${id}/employment-relationships/${id}`)
      .set('x-access-token', token)
      .send(makeFakeEmploymentRelationshipParams());

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      associatedId: 1,
      contractType: 'contract_type',
      finalDate: expect.any(String),
      id: expect.any(Number),
      occupation: 'any_occupation',
      paymentDay: 5,
      publicAgency: 'any_agency',
      registerNumber: 'any_register_number',
      salary: 'any_salary',
      isDefault: true,
    });
  });

  it('Should return 404 when associated does not exists', async () => {
    const id = 999999;
    const response = await global.testRequest
      .patch(`/associateds/${id}/employment-relationships/${id}`)
      .set('x-access-token', token)
      .send(makeFakeEmploymentRelationshipParams());
    expect(response.body).toEqual(
      makeNotFoundResponse('associated not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const id = 1;
    const response = await global.testRequest
      .patch(`/associateds/${id}/employment-relationships/${id}`)
      .set('x-access-token', token)
      .send({
        contractType: 2,
        finalDate: '2',
        id: '1',
        occupation: 2,
        paymentDay: 5,
        publicAgency: 2,
        registerNumber: 10,
        salary: 2,
      });

    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'occupation',
        friendlyFieldName: 'profissão',
        message: '"profissão" must be a string',
      },
      {
        fieldName: 'salary',
        friendlyFieldName: 'salário',
        message: '"salário" must be a string',
      },
      {
        fieldName: 'registerNumber',
        friendlyFieldName: 'matrícula',
        message: '"matrícula" must be a string',
      },
      {
        fieldName: 'contractType',
        friendlyFieldName: 'tipo de contrato',
        message: '"tipo de contrato" must be a string',
      },
      {
        fieldName: 'publicAgency',
        friendlyFieldName: 'órgão público',
        message: '"órgão público" must be a string',
      },
    ]);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('Should return 200 when receive just one param', async () => {
    const id = 1;

    const response = await global.testRequest
      .patch(`/associateds/${id}/employment-relationships/${id}`)
      .set('x-access-token', token)
      .send(makeFakeEmploymentRelationshipParams());

    expect(response.body.data).toEqual({
      associatedId: 1,
      contractType: 'contract_type',
      finalDate: expect.any(String),
      id: expect.any(Number),
      occupation: 'any_occupation',
      paymentDay: 5,
      publicAgency: 'any_agency',
      registerNumber: 'any_register_number',
      salary: 'any_salary',
      isDefault: true,
    });
    expect(response.status).toBe(200);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const id = 1;
    jest
      .spyOn(AssociatedService.prototype, 'upsertEmploymentRelationshipById')
      .mockRejectedValueOnce(new Error('updateById unexpected error'));

    const response = await global.testRequest
      .patch(`/associateds/${id}/employment-relationships/${id}`)
      .set('x-access-token', token)
      .send(makeFakeEmploymentRelationshipParams());

    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
