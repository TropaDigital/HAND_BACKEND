import { ConsultantService } from '../../../src/modules/consultant/service';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
} from '../../helpers';
import { populateDatabase } from './helpers/testHelper';

describe('DELETE /consultants/{id} - Delete consultant by id', () => {
  beforeAll(async () => {
    await global.prismaClient.consultant.deleteMany();
    await populateDatabase();
  });

  it('Should return 204 when the consultant is deleted', async () => {
    const id = 1;

    const response = await global.testRequest.delete(`/consultants/${id}`);

    expect(response.body).toEqual({});
    expect(response.status).toBe(204);
  });

  it('Should return 404 when consultant does not exists', async () => {
    const id = 10;
    const response = await global.testRequest.delete(`/consultants/${id}`);

    expect(response.body).toEqual(
      makeNotFoundResponse('consultant not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const id = 0;
    const response = await global.testRequest.delete(`/consultants/${id}`);

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
      .spyOn(ConsultantService.prototype, 'deleteById')
      .mockRejectedValueOnce(new Error('deleteById unexpected error'));

    const response = await global.testRequest.delete(`/consultants/${id}`);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
