import {
  makeFakeCreateConsultantParams,
  makeInvalidParamsResponse,
} from './helpers/testHelper';

describe('GetConsultantsById', () => {
  beforeAll(async () => {
    await global.prismaClient.Consultant.deleteMany();
  });

  it('Should return 200 with created consultant', async () => {
    const params = makeFakeCreateConsultantParams();

    const response = await global.testRequest.post(`/consultants`).send(params);

    expect(response.body.data).toEqual(expect.objectContaining(params));
    expect(response.status).toBe(201);
  });

  it('Should return 400 when receive invalid params', async () => {
    const params = {
      name: 'Vinicius',
      city: 'Fortaleza',
      taxId: '784541231',
    };

    const response = await global.testRequest.post(`/consultants`).send(params);

    expect(response.body).toEqual(
      makeInvalidParamsResponse([
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
      ]),
    );
    expect(response.status).toBe(400);
  });
});
