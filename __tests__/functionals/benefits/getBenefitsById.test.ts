import { BenefitService } from '../../../src/modules/benefit/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
} from '../helpers';
import { populateDatabase as populateUsersDatabase } from '../users/helpers';
import { populateDatabase, makeFakeCreateBenefitParams } from './helpers';

describe('GET /benefits/{id} - Get benefit by id', () => {
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

  it('Should return 200 with benefit', async () => {
    const id = 1;

    const response = await global.testRequest
      .get(`/benefits/${id}`)
      .set('x-access-token', token);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        ...makeFakeCreateBenefitParams({ associated: 'João' }),
        initialDate: '2022-10-10T00:00:00.000Z',
      }),
    );
    expect(response.status).toBe(200);
  });

  it('Should return 404 and empty array when there is no benefit', async () => {
    await global.prismaClient.benefit.deleteMany();
    const id = 10;
    const response = await global.testRequest
      .get(`/benefits/${id}`)
      .set('x-access-token', token);
    expect(response.body).toEqual(
      makeNotFoundResponse('benefit not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const id = 0;
    const response = await global.testRequest
      .get(`/benefits/${id}`)
      .set('x-access-token', token);

    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'id',
        friendlyFieldName: 'id',
        message: '"id" must be greater than or equal to 1',
      },
    ]);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const id = 1;
    jest
      .spyOn(BenefitService.prototype, 'getById')
      .mockRejectedValueOnce(new Error('getById unexpected error'));

    const response = await global.testRequest
      .get(`/benefits/${id}`)
      .set('x-access-token', token);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});