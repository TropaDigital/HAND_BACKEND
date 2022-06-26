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

  it('Should return 200 and all associateds', async () => {
    const response = await global.testRequest
      .get('/associateds')
      .set('x-access-token', token);

    expect(response.body.data).toEqual([
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
    ]);
    expect(response.status).toBe(200);
  });

  it('Should return 200 and empty array when there is no associated', async () => {
    await global.prismaClient.associated.deleteMany();

    const response = await global.testRequest
      .get('/associateds')
      .set('x-access-token', token);

    expect(response.body.data).toEqual([]);
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
