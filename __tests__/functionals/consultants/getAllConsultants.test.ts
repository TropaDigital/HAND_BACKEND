import { ConsultantService } from '../../../src/modules/consultant/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import { makeInternalErrorResponse } from '../helpers';
import { populateDatabase as populateUsersDatabase } from '../users/helpers';
import { populateDatabase, makeFakeConsultant } from './helpers';

describe('GET /consultants - Get all consultants', () => {
  const token = new AuthenticationService().generateToken({
    sub: 1,
    role: 'VALID_ROLE',
  });

  beforeAll(async () => {
    await populateUsersDatabase();
    await global.prismaClient.consultant.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient?.consultant.deleteMany();
  });

  it('Should return 200 and all consultants', async () => {
    const response = await global.testRequest
      .get('/consultants')
      .set('x-access-token', token);

    expect(response.body.data).toEqual([
      expect.objectContaining({
        ...makeFakeConsultant({ name: 'João', id: 1 }),
        id: 1,
        deletedAt: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        updatedBy: null,
      }),
      expect.objectContaining({
        ...makeFakeConsultant({ name: 'Pedro', id: 2 }),

        deletedAt: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        updatedBy: null,
      }),
    ]);
    expect(response.status).toBe(200);
  });

  it('Should return 200 and empty array when there is no consultant', async () => {
    await global.prismaClient.consultant.deleteMany();

    const response = await global.testRequest
      .get('/consultants')
      .set('x-access-token', token);

    expect(response.body.data).toEqual([]);
    expect(response.status).toBe(200);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    jest
      .spyOn(ConsultantService.prototype, 'getAll')
      .mockRejectedValueOnce(new Error('getAll unexpected error'));

    const response = await global.testRequest
      .get(`/consultants`)
      .set('x-access-token', token);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
