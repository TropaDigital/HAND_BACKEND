import { getFirstDatabaseClient, populateDatabase } from './helpers/testHelper';

const makeNotFoundResponse = (description: string) => {
  return {
    code: 'GENERIC_ERROR',
    description,
    statusCode: 404,
    statusCodeAsString: 'NOT_FOUND',
    validationErrors: [],
  };
};

describe('GetConsultantsById', () => {
  beforeAll(async () => {
    await global.prismaClient.Consultant.deleteMany();
    await populateDatabase();
  });

  it('Should return 204 with updated', async () => {
    const id = await getFirstDatabaseClient();

    const response = await global.testRequest.delete(`/consultants/${id}`);

    expect(response.body).toEqual({});
    expect(response.status).toBe(204);
  });

  it('Should return 404 when consultant does not exists', async () => {
    const response = await global.testRequest.delete(`/consultants/0`);

    expect(response.body).toEqual(
      makeNotFoundResponse('consultant not found with provided id'),
    );
    expect(response.status).toBe(404);
  });
});
