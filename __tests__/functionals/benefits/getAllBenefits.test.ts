import { BenefitService } from '../../../src/modules/benefit/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import { makeInternalErrorResponse } from '../helpers';
import { populateDatabase as populateUsersDatabase } from '../users/helpers';
import { makeFakeBenefit, populateDatabase } from './helpers';

describe('GET /benefits - Get all benefits', () => {
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

    expect(response.body.data).toEqual([
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
    ]);
    expect(response.status).toBe(200);
  });

  it('Should return 200 and empty array when there is no benefit', async () => {
    await global.prismaClient.benefit.deleteMany();

    const response = await global.testRequest
      .get('/benefits')
      .set('x-access-token', token);

    expect(response.body.data).toEqual([]);
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
