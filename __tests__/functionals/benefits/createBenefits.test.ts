import { BenefitService } from '../../../src/modules/benefit/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
} from '../helpers';
import { populateDatabase } from '../users/helpers';
import { makeFakeCreateBenefitParams } from './helpers';

describe.skip('POST /benefits - Create new benefit', () => {
  const token = new AuthenticationService().generateToken({
    sub: 'User',
    role: 'VALID_ROLE',
  });

  beforeAll(async () => {
    await global.prismaClient.benefit.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.benefit.deleteMany();
  });

  it('Should return 201 with created benefit', async () => {
    const params = makeFakeCreateBenefitParams();

    const response = await global.testRequest
      .post(`/benefits`)
      .set('x-access-token', token)
      .send(params);

    expect(response.body.data).toEqual(
      expect.objectContaining({
        ...params,
        initialDate: '2022-10-10T00:00:00.000Z',
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
        fieldName: 'associated',
        friendlyFieldName: 'associated',
        message: '"associated" is required',
      },
      {
        fieldName: 'association',
        friendlyFieldName: 'association',
        message: '"association" is required',
      },
      {
        fieldName: 'bank',
        friendlyFieldName: 'bank',
        message: '"bank" is required',
      },
      {
        fieldName: 'publicAgency',
        friendlyFieldName: 'publicAgency',
        message: '"publicAgency" is required',
      },
      {
        fieldName: 'contractModel',
        friendlyFieldName: 'contractModel',
        message: '"contractModel" is required',
      },
      {
        fieldName: 'installmentNumber',
        friendlyFieldName: 'installmentNumber',
        message: '"installmentNumber" is required',
      },
      {
        fieldName: 'initialDate',
        friendlyFieldName: 'initialDate',
        message: '"initialDate" is required',
      },
      {
        fieldName: 'financialAssistanceValue',
        friendlyFieldName: 'financialAssistanceValue',
        message: '"financialAssistanceValue" is required',
      },
      {
        fieldName: 'installmentValue',
        friendlyFieldName: 'installmentValue',
        message: '"installmentValue" is required',
      },
      {
        fieldName: 'consultant',
        friendlyFieldName: 'consultant',
        message: '"consultant" is required',
      },
    ]);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const params = makeFakeCreateBenefitParams();
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
