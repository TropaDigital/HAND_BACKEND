import { ConsultantService } from '../../../src/modules/consultant/service';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
} from '../../helpers';
import {
  populateDatabase,
  makeFakeCreateConsultantParams,
} from './helpers/testHelper';

describe('GET /consultants/{id} - Get consultant by id', () => {
  beforeAll(async () => {
    await global.prismaClient.consultant.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.consultant.deleteMany();
  });

  it('Should return 200 with consultant', async () => {
    const id = 1;

    const response = await global.testRequest.get(`/consultants/${id}`);
    expect(response.body.data).toEqual(
      expect.objectContaining(makeFakeCreateConsultantParams({ name: 'João' })),
    );
    expect(response.status).toBe(200);
  });

  it('Should return 404 and empty array when there is no consultant', async () => {
    await global.prismaClient.consultant.deleteMany();
    const id = 10;
    const response = await global.testRequest.get(`/consultants/${id}`);
    expect(response.body).toEqual(
      makeNotFoundResponse('consultant not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const id = 0;
    const response = await global.testRequest.get(`/consultants/${id}`);

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
      .spyOn(ConsultantService.prototype, 'getById')
      .mockRejectedValueOnce(new Error('getById unexpected error'));

    const response = await global.testRequest.get(`/consultants/${id}`);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
