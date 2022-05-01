import { ConsultantService } from '../../../src/modules/consultant/service';
import { makeInternalErrorResponse } from '../helpers';
import { populateDatabase, makeFakeConsultant } from './helpers';

describe('GET /consultants - Get all consultants', () => {
  beforeAll(async () => {
    await global.prismaClient.consultant.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.consultant.deleteMany();
  });

  it('Should return 200 and all consultants', async () => {
    const response = await global.testRequest.get('/consultants');

    expect(response.body.data).toEqual([
      expect.objectContaining(makeFakeConsultant({ name: 'João' })),
      expect.objectContaining(makeFakeConsultant({ name: 'Pedro' })),
    ]);
    expect(response.status).toBe(200);
  });

  it('Should return 200 and empty array when there is no consultant', async () => {
    await global.prismaClient.consultant.deleteMany();

    const response = await global.testRequest.get('/consultants');

    expect(response.body.data).toEqual([]);
    expect(response.status).toBe(200);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    jest
      .spyOn(ConsultantService.prototype, 'getAll')
      .mockRejectedValueOnce(new Error('getAll unexpected error'));

    const response = await global.testRequest.get(`/consultants`);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
