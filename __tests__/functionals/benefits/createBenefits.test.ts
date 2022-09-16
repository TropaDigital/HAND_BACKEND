import { BenefitService } from '../../../src/modules/benefit/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import { populateDatabase as populateAssociatedDatabase } from '../associations/helpers';
import { populateDatabase as populateConsultantDatabase } from '../consultants/helpers';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
} from '../helpers';
import { populateDatabase } from '../users/helpers';
import { makeFakeCreateBenefitParams } from './helpers';

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

  it.skip('Should return 201 with created benefit', async () => {
    const params = await makeFakeCreateBenefitParams();

    const response = await global.testRequest
      .post(`/benefits`)
      .set('x-access-token', token)
      .send(params);

    expect(response.body).toBe('');
    expect(response.body.data).toEqual(
      expect.objectContaining({
        ...params,
        initialDate: expect.any(String),
      }),
    );
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
        fieldName: 'affiliation',
        friendlyFieldName: 'affiliation',
        message: '"affiliation" is required',
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
