import { BenefitService } from '../../../src/modules/benefit/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import { populateDatabase as populateAssociatedDatabase } from '../associations/helpers';
import { populateDatabase as populateConsultantDatabase } from '../consultants/helpers';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
} from '../helpers';
import { populateDatabase } from '../users/helpers';
import { makeFakeBenefit, makeFakeCreateBenefitParams } from './helpers';

describe('POST /benefits - Create new benefit', () => {
  const token = new AuthenticationService().generateToken({
    sub: 'User',
    role: 'VALID_ROLE',
  });

  beforeAll(async () => {
    await global.prismaClient.benefit.deleteMany();
    await populateConsultantDatabase();
    await populateAssociatedDatabase();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient?.benefit.deleteMany();
  });

  it.only('Should return 201 with created benefit', async () => {
    const params = await makeFakeCreateBenefitParams();

    const response = await global.testRequest
      .post(`/benefits`)
      .set('x-access-token', token)
      .send(params);

    expect(response.body.data).toEqual({
      ...makeFakeBenefit({
        id: expect.any(Number),
        affiliationId: 1,
        consultantId: 1,
        name: 'João',
        lastName: 'Any name',
        type: 'N',
        birthDate: expect.any(String),
        createdAt: expect.any(String),
        emissionDate: expect.any(String),
        initialDate: expect.any(String),
        updatedAt: expect.any(String),
      }),
    });
    expect(response.status).toBe(201);
  });

  it('Should return 400 when receive invalid params', async () => {
    const params = {
      name: 'Vinicius',
      city: 'Fortaleza',
      taxId: '784541231',
    };

    const response = await global.testRequest
      .post(`/benefits`)
      .set('x-access-token', token)
      .send(params);
    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'affiliationId',
        friendlyFieldName: 'affiliationId',
        message: '"affiliationId" is required',
      },
      {
        fieldName: 'addressId',
        friendlyFieldName: 'addressId',
        message: '"addressId" is required',
      },
      {
        fieldName: 'bankAccountId',
        friendlyFieldName: 'bankAccountId',
        message: '"bankAccountId" is required',
      },
      {
        fieldName: 'employmentRelationshipId',
        friendlyFieldName: 'employmentRelationshipId',
        message: '"employmentRelationshipId" is required',
      },
      {
        fieldName: 'associatedId',
        friendlyFieldName: 'associatedId',
        message: '"associatedId" is required',
      },
      {
        fieldName: 'numberOfInstallments',
        friendlyFieldName: 'numberOfInstallments',
        message: '"numberOfInstallments" is required',
      },
      {
        fieldName: 'requestedValue',
        friendlyFieldName: 'requestedValue',
        message: '"requestedValue" is required',
      },
      {
        fieldName: 'salary',
        friendlyFieldName: 'salary',
        message: '"salary" is required',
      },
      {
        fieldName: 'monthOfPayment',
        friendlyFieldName: 'monthOfPayment',
        message: '"monthOfPayment" is required',
      },
    ]);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const params = await makeFakeCreateBenefitParams();
    jest
      .spyOn(BenefitService.prototype, 'create')
      .mockRejectedValueOnce(new Error('create unexpected error'));
    const response = await global.testRequest
      .post(`/benefits`)
      .set('x-access-token', token)
      .send(params);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
