import { makeFakeConsultant, populateDatabase } from './helpers/testHelper';

describe('GetAllConsultants', () => {
  beforeAll(async () => {
    await global.prismaClient.Consultant.deleteMany();
    await populateDatabase();
  });

  it('Should return 200 and all consultants', async () => {
    const response = await global.testRequest.get('/consultants');

    expect(response.body.data).toEqual([
      expect.objectContaining(makeFakeConsultant('João')),
      expect.objectContaining(makeFakeConsultant('Pedro')),
    ]);
    expect(response.status).toBe(200);
  });

  it('Should return 200 and empty array when there is no consultant', async () => {
    await global.prismaClient.Consultant.deleteMany();

    const response = await global.testRequest.get('/consultants');

    expect(response.body.data).toEqual([]);
    expect(response.status).toBe(200);
  });
});
