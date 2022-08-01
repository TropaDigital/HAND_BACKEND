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
    await global.prismaClient.address.deleteMany();
    await global.prismaClient.employmentRelationship.deleteMany();
  });

  it('Should return 200 with updated', async () => {
    const id = 1;

    const response = await global.testRequest
      .patch(`/associateds/employment-relationships/${id}`)
      .set('x-access-token', token)
      .send(
        makeFakeEmploymentRelationshipParams({
          associatedId: id,
        }),
      );

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
    });
  });

  it('Should return 404 when associated does not exists', async () => {
    const id = 999999;
    const response = await global.testRequest
      .patch(`/associateds/employment-relationships/${id}`)
      .set('x-access-token', token)
      .send(makeFakeEmploymentRelationshipParams({ associatedId: id }));
    expect(response.body).toEqual(
      makeNotFoundResponse('associated not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const id = 1;
    const response = await global.testRequest
      .patch(`/associateds/employment-relationships/${id}`)
      .set('x-access-token', token)
      .send('');

    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'associatedId',
        friendlyFieldName: 'associatedId',
        message: '"associatedId" is required',
      },
    ]);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('Should return 200 when receive just one param', async () => {
    const id = 1;

    const response = await global.testRequest
      .patch(`/associateds/employment-relationships/${id}`)
      .set('x-access-token', token)
      .send(makeFakeEmploymentRelationshipParams({ associatedId: 1 }));
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
    });
    expect(response.status).toBe(200);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const id = 1;
    jest
      .spyOn(AssociatedService.prototype, 'upsertEmploymentRelationshipById')
      .mockRejectedValueOnce(new Error('updateById unexpected error'));

    const response = await global.testRequest
      .patch(`/associateds/employment-relationships/${id}`)
      .set('x-access-token', token)
      .send(makeFakeEmploymentRelationshipParams({ associatedId: 1 }));
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
