import { AssociatedService } from '../../../src/modules/associated/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import { makeInternalErrorResponse } from '../helpers';
import { populateDatabase as populateUsersDatabase } from '../users/helpers';
import { makeFakeAssociated, populateDatabase } from './helpers';

describe('GET /associateds - Get all associateds', () => {
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

  it('Should return 200 and all associates', async () => {
    const response = await global.testRequest
      .get('/associateds')
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalResults: 3,
      data: [
        expect.objectContaining({
          ...{
            ...makeFakeAssociated({ name: 'João', id: 1, taxId: '1' }),
            emissionDate: '2022-10-10T00:00:00.000Z',
            birthDate: '2022-10-10T00:00:00.000Z',
          },
        }),
        expect.objectContaining({
          ...makeFakeAssociated({ name: 'Pedro', id: 2, taxId: '2' }),
          emissionDate: '2022-10-10T00:00:00.000Z',
          birthDate: '2022-10-10T00:00:00.000Z',
        }),
        expect.objectContaining({
          ...makeFakeAssociated({ name: 'Mateus', id: 3, taxId: '3' }),
          emissionDate: '2022-10-10T00:00:00.000Z',
          birthDate: '2022-10-10T00:00:00.000Z',
        }),
      ],
    });
    expect(response.status).toBe(200);
  });

  it('Should return 200 and paginated associates when fetch for first page', async () => {
    const response = await global.testRequest
      .get('/associateds')
      .query({ page: 1, resultsPerPage: 2 })
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 1,
      totalPages: 2,
      totalResults: 3,
      data: [
        expect.objectContaining({
          ...{
            ...makeFakeAssociated({ name: 'João', id: 1, taxId: '1' }),
            emissionDate: '2022-10-10T00:00:00.000Z',
            birthDate: '2022-10-10T00:00:00.000Z',
          },
        }),
        expect.objectContaining({
          ...makeFakeAssociated({ name: 'Pedro', id: 2, taxId: '2' }),
          emissionDate: '2022-10-10T00:00:00.000Z',
          birthDate: '2022-10-10T00:00:00.000Z',
        }),
      ],
    });
    expect(response.status).toBe(200);
  });

  it('Should return 200 and paginated associates when fetch for last page', async () => {
    const response = await global.testRequest
      .get('/associateds')
      .query({ page: 2, resultsPerPage: 2 })
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 2,
      totalPages: 2,
      totalResults: 3,
      data: [
        expect.objectContaining({
          ...makeFakeAssociated({ name: 'Mateus', id: 3, taxId: '3' }),
          emissionDate: '2022-10-10T00:00:00.000Z',
          birthDate: '2022-10-10T00:00:00.000Z',
        }),
      ],
    });
    expect(response.status).toBe(200);
  });

  it('Should return 200 and empty array when there is no associated', async () => {
    await global.prismaClient.associated.deleteMany();

    const response = await global.testRequest
      .get('/associateds')
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
      .spyOn(AssociatedService.prototype, 'getAll')
      .mockRejectedValueOnce(new Error('getAll unexpected error'));

    const response = await global.testRequest
      .get(`/associateds`)
      .set('x-access-token', token);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
