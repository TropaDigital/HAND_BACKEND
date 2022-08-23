import { BenefitService } from '../../../src/modules/benefit/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import { makeInternalErrorResponse } from '../helpers';
import { populateDatabase as populateUsersDatabase } from '../users/helpers';
import { makeFakeBenefit, populateDatabase } from './helpers';

describe.skip('GET /benefits - Get all benefits', () => {
  const token = new AuthenticationService().generateToken({
    sub: 1,
    role: 'VALID_ROLE',
  });

  beforeAll(async () => {
    await populateUsersDatabase();
    await global.prismaClient.benefit.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.benefit.deleteMany();
  });

  it('Should return 200 and all benefits', async () => {
    const response = await global.testRequest
      .get('/benefits')
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalResults: 3,
      data: [
        expect.objectContaining({
          ...makeFakeBenefit({
            associated: 'João',
          }),
          initialDate: '2022-10-10T00:00:00.000Z',
        }),
        expect.objectContaining({
          ...makeFakeBenefit({
            associated: 'Pedro',
          }),
          initialDate: '2022-10-10T00:00:00.000Z',
        }),
        expect.objectContaining({
          ...makeFakeBenefit({
            associated: 'Mateus',
          }),
          initialDate: '2022-10-10T00:00:00.000Z',
        }),
      ],
    });
    expect(response.status).toBe(200);
  });

  it('Should return 200 and paginated associates when fetch for first page', async () => {
    const response = await global.testRequest
      .get('/benefits')
      .query({ page: 1, resultsPerPage: 2 })
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 1,
      totalPages: 2,
      totalResults: 3,
      data: [
        expect.objectContaining({
          ...makeFakeBenefit({
            associated: 'João',
          }),
          initialDate: '2022-10-10T00:00:00.000Z',
        }),
        expect.objectContaining({
          ...makeFakeBenefit({
            associated: 'Pedro',
          }),
          initialDate: '2022-10-10T00:00:00.000Z',
        }),
      ],
    });
    expect(response.status).toBe(200);
  });

  it('Should return 200 and paginated associates when filter params is provided in query params', async () => {
    const response = await global.testRequest
      .get('/benefits')
      .query({ page: 1, resultsPerPage: 2, associated: 'Pedro' })
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalResults: 1,
      data: [
        expect.objectContaining({
          ...makeFakeBenefit({
            associated: 'Pedro',
          }),
          initialDate: '2022-10-10T00:00:00.000Z',
        }),
      ],
    });
    expect(response.status).toBe(200);
  });

  it('Should return 200 and paginated associates when filter params with partial value', async () => {
    const response = await global.testRequest
      .get('/benefits')
      .query({ page: 1, resultsPerPage: 2, associated: 'Ped' })
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalResults: 1,
      data: [
        expect.objectContaining({
          ...makeFakeBenefit({
            associated: 'Pedro',
          }),
          initialDate: '2022-10-10T00:00:00.000Z',
        }),
      ],
    });
    expect(response.status).toBe(200);
  });

  it('Should return 200 and paginated associates when fetch for last page', async () => {
    const response = await global.testRequest
      .get('/benefits')
      .query({ page: 2, resultsPerPage: 2 })
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 2,
      totalPages: 2,
      totalResults: 3,
      data: [
        expect.objectContaining({
          ...makeFakeBenefit({
            associated: 'Mateus',
          }),
          initialDate: '2022-10-10T00:00:00.000Z',
        }),
      ],
    });
    expect(response.status).toBe(200);
  });
  it('Should return 200 and empty array when there is no benefit', async () => {
    await global.prismaClient.benefit.deleteMany();

    const response = await global.testRequest
      .get('/benefits')
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 1,
      data: [],
      totalPages: 1,
      totalResults: 0,
    });
    expect(response.status).toBe(200);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    jest
      .spyOn(BenefitService.prototype, 'getAll')
      .mockRejectedValueOnce(new Error('getAll unexpected error'));

    const response = await global.testRequest
      .get(`/benefits`)
      .set('x-access-token', token);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
