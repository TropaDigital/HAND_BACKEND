import {
  getFirstDatabaseClient,
  makeFakeCreateConsultantParams,
  makeNotFoundResponse,
  populateDatabase,
} from './helpers/testHelper';

describe('GetConsultantsById', () => {
  beforeAll(async () => {
    await global.prismaClient.Consultant.deleteMany();
    await populateDatabase();
  });

  it('Should return 200 with consultant', async () => {
    const id = await getFirstDatabaseClient();

    const response = await global.testRequest.get(`/consultants/${id}`);
    expect(response.body.data).toEqual(
      expect.objectContaining(makeFakeCreateConsultantParams('João')),
    );
    expect(response.status).toBe(200);
  });

  it('Should return 404 and empty array when there is no consultant', async () => {
    await global.prismaClient.Consultant.deleteMany();
    const response = await global.testRequest.get('/consultants/0');
    expect(response.body).toEqual(
      makeNotFoundResponse('consultant not found with provided id'),
    );
    expect(response.status).toBe(404);
  });
});
