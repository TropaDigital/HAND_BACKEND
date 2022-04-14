import {
  getFirstDatabaseClient,
  makeNotFoundResponse,
  populateDatabase,
} from './helpers/testHelper';

describe('GetConsultantsById', () => {
  beforeAll(async () => {
    await global.prismaClient.Consultant.deleteMany();
    await populateDatabase();
  });

  it('Should return 204 with updated', async () => {
    const id = await getFirstDatabaseClient();

    const response = await global.testRequest.patch(`/consultants/${id}`).send({
      name: 'Vinicius',
      city: 'Fortaleza',
      taxId: '784541231',
      state: 'Ceará',
      createdBy: 'Pedro',
    });

    expect(response.body).toEqual({});
    expect(response.status).toBe(204);
  });

  it('Should return 404 when consultant does not exists', async () => {
    const response = await global.testRequest.patch(`/consultants/0`).send({
      name: 'Vinicius',
      city: 'Fortaleza',
      taxId: '784541231',
      state: 'Ceará',
      createdBy: 'Pedro',
    });
    expect(response.body).toEqual(
      makeNotFoundResponse('consultant not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 204 when receive just one param', async () => {
    const id = await getFirstDatabaseClient();

    const response = await global.testRequest.patch(`/consultants/${id}`).send({
      name: 'João',
    });
    expect(response.body).toEqual({});
    expect(response.status).toBe(204);
  });
});
