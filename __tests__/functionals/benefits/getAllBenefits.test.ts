import { BenefitService } from '../../../src/modules/benefit/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import { populateDatabase as populateAssociatedDatabase } from '../associations/helpers';
import { makeInternalErrorResponse } from '../helpers';
import { populateDatabase as populateUsersDatabase } from '../users/helpers';
import { makeFakeBenefit, populateDatabase } from './helpers';

describe('GET /benefits - Get all benefits', () => {
  const token = new AuthenticationService().generateToken({
    sub: 'User',
    role: 'VALID_ROLE',
  });

  beforeAll(async () => {
    await populateUsersDatabase();
    await populateAssociatedDatabase();
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

    expect(response.body.data).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalResults: 3,
      data: [
        {
          ...makeFakeBenefit({
            associatedId: 1,
            id: 1,
          }),
          consultant: null,
          affiliation: {
            createdAt: expect.anything(),
            deletedAt: null,
            id: 1,
            name: '1',
            updatedAt: expect.anything(),
          },
          associated: {
            birthDate: expect.anything(),
            cellPhone: '00000000',
            createdAt: expect.anything(),
            createdBy: 'Any User',
            deletedAt: null,
            email: 'any@mail.com',
            emissionDate: expect.anything(),
            emissionState: 'Any state',
            father: 'Any father',
            gender: 'Any gender',
            id: 1,
            issuingAgency: 'Any agency',
            lastName: 'Any name',
            maritalStatus: 'Any status',
            mother: 'Any mother',
            name: 'João',
            nationality: 'Any nationality',
            partner: 'Any partner',
            placeOfBirth: 'Any place',
            registerId: 'Any id',
            taxId: '1',
            updatedAt: expect.anything(),
            updatedBy: null,
          },
          updatedAt: expect.any(String),
          birthDate: expect.any(String),
          createdAt: expect.any(String),
          emissionDate: expect.any(String),
          initialDate: expect.any(String),
          finalDate: null,
        },
        {
          ...makeFakeBenefit({
            associatedId: 2,
            id: 2,
            affiliationId: 2,
          }),
          consultant: null,
          affiliation: {
            createdAt: expect.anything(),
            deletedAt: null,
            id: 2,
            name: '2',
            updatedAt: expect.anything(),
          },
          associated: {
            birthDate: expect.anything(),
            cellPhone: '00000000',
            createdAt: expect.anything(),
            createdBy: 'Any User',
            deletedAt: null,
            email: 'any@mail.com',
            emissionDate: expect.anything(),
            emissionState: 'Any state',
            father: 'Any father',
            gender: 'Any gender',
            id: 2,
            issuingAgency: 'Any agency',
            lastName: 'Any name',
            maritalStatus: 'Any status',
            mother: 'Any mother',
            name: 'Pedro',
            nationality: 'Any nationality',
            partner: 'Any partner',
            placeOfBirth: 'Any place',
            registerId: 'Any id',
            taxId: '2',
            updatedAt: expect.anything(),
            updatedBy: null,
          },
          updatedAt: expect.any(String),
          birthDate: expect.any(String),
          createdAt: expect.any(String),
          emissionDate: expect.any(String),
          initialDate: expect.any(String),
          finalDate: null,
        },
        {
          ...makeFakeBenefit({
            associatedId: 3,
            id: 3,
            affiliationId: 3,
          }),
          consultant: null,
          affiliation: {
            createdAt: expect.anything(),
            deletedAt: null,
            id: 3,
            name: '3',
            updatedAt: expect.anything(),
          },
          associated: {
            birthDate: expect.anything(),
            cellPhone: '00000000',
            createdAt: expect.anything(),
            createdBy: 'Any User',
            deletedAt: null,
            email: 'any@mail.com',
            emissionDate: expect.anything(),
            emissionState: 'Any state',
            father: 'Any father',
            gender: 'Any gender',
            id: 3,
            issuingAgency: 'Any agency',
            lastName: 'Any name',
            maritalStatus: 'Any status',
            mother: 'Any mother',
            name: 'Paulo',
            nationality: 'Any nationality',
            partner: 'Any partner',
            placeOfBirth: 'Any place',
            registerId: 'Any id',
            taxId: '3',
            updatedAt: expect.anything(),
            updatedBy: null,
          },
          updatedAt: expect.any(String),
          birthDate: expect.any(String),
          createdAt: expect.any(String),
          emissionDate: expect.any(String),
          initialDate: expect.any(String),
          finalDate: null,
        },
      ],
    });
    expect(response.status).toBe(200);
  });

  it('Should return 200 and paginated associates when fetch for first page', async () => {
    const response = await global.testRequest
      .get('/benefits')
      .query({ page: 1, resultsPerPage: 2 })
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 1,
      totalPages: 2,
      totalResults: 3,
      data: [
        {
          ...makeFakeBenefit({
            associatedId: 1,
            id: 1,
            affiliationId: 1,
          }),
          consultant: null,
          affiliation: {
            createdAt: expect.anything(),
            deletedAt: null,
            id: 1,
            name: '1',
            updatedAt: expect.anything(),
          },
          associated: {
            birthDate: expect.anything(),
            cellPhone: '00000000',
            createdAt: expect.anything(),
            createdBy: 'Any User',
            deletedAt: null,
            email: 'any@mail.com',
            emissionDate: expect.anything(),
            emissionState: 'Any state',
            father: 'Any father',
            gender: 'Any gender',
            id: 1,
            issuingAgency: 'Any agency',
            lastName: 'Any name',
            maritalStatus: 'Any status',
            mother: 'Any mother',
            name: 'João',
            nationality: 'Any nationality',
            partner: 'Any partner',
            placeOfBirth: 'Any place',
            registerId: 'Any id',
            taxId: '1',
            updatedAt: expect.anything(),
            updatedBy: null,
          },
          updatedAt: expect.any(String),
          birthDate: expect.any(String),
          createdAt: expect.any(String),
          emissionDate: expect.any(String),
          initialDate: expect.any(String),
          finalDate: null,
        },
        {
          ...makeFakeBenefit({
            associatedId: 2,
            id: 2,
            affiliationId: 2,
          }),
          consultant: null,
          affiliation: {
            createdAt: expect.anything(),
            deletedAt: null,
            id: 2,
            name: '2',
            updatedAt: expect.anything(),
          },
          associated: {
            birthDate: expect.anything(),
            cellPhone: '00000000',
            createdAt: expect.anything(),
            createdBy: 'Any User',
            deletedAt: null,
            email: 'any@mail.com',
            emissionDate: expect.anything(),
            emissionState: 'Any state',
            father: 'Any father',
            gender: 'Any gender',
            id: 2,
            issuingAgency: 'Any agency',
            lastName: 'Any name',
            maritalStatus: 'Any status',
            mother: 'Any mother',
            name: 'Pedro',
            nationality: 'Any nationality',
            partner: 'Any partner',
            placeOfBirth: 'Any place',
            registerId: 'Any id',
            taxId: '2',
            updatedAt: expect.anything(),
            updatedBy: null,
          },
          updatedAt: expect.any(String),
          birthDate: expect.any(String),
          createdAt: expect.any(String),
          emissionDate: expect.any(String),
          initialDate: expect.any(String),
          finalDate: null,
        },
      ],
    });
    expect(response.status).toBe(200);
  });

  it.only('Should return 200 and paginated associates when filter params is provided in query params', async () => {
    const response = await global.testRequest
      .get('/benefits')
      .query({ page: 1, resultsPerPage: 2, associated: { name: 'Pedro' } })
      .set('x-access-token', token);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalResults: 1,
      data: [
        {
          ...makeFakeBenefit({
            associatedId: 2,
            id: 2,
            affiliationId: 2,
          }),
          updatedAt: expect.any(String),
          birthDate: expect.any(String),
          createdAt: expect.any(String),
          emissionDate: expect.any(String),
          initialDate: expect.any(String),
          finalDate: null,
        },
      ],
    });
  });

  it('Should return 200 and paginated associates when filter params with partial value', async () => {
    const response = await global.testRequest
      .get('/benefits')
      .query({ page: 1, resultsPerPage: 2, associated: { name: 'Ped' } })
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalResults: 1,
      data: [
        {
          ...makeFakeBenefit({
            associatedId: 2,
            id: 2,
            affiliationId: 2,
          }),
          updatedAt: expect.any(String),
          birthDate: expect.any(String),
          createdAt: expect.any(String),
          emissionDate: expect.any(String),
          initialDate: expect.any(String),
          finalDate: null,
        },
      ],
    });
    expect(response.status).toBe(200);
  });

  it('Should return 200 and paginated associates when fetch for last page', async () => {
    const response = await global.testRequest
      .get('/benefits')
      .query({ page: 2, resultsPerPage: 2 })
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 2,
      totalPages: 2,
      totalResults: 3,
      data: [
        {
          ...makeFakeBenefit({
            id: 3,
            associatedId: 3,
            affiliationId: 3,
          }),
          affiliation: {
            createdAt: expect.anything(),
            deletedAt: null,
            id: 3,
            name: '3',
            updatedAt: expect.anything(),
          },
          consultant: null,
          associated: {
            birthDate: expect.anything(),
            cellPhone: '00000000',
            createdAt: expect.anything(),
            createdBy: 'Any User',
            deletedAt: null,
            email: 'any@mail.com',
            emissionDate: expect.anything(),
            emissionState: 'Any state',
            father: 'Any father',
            gender: 'Any gender',
            id: 3,
            issuingAgency: 'Any agency',
            lastName: 'Any name',
            maritalStatus: 'Any status',
            mother: 'Any mother',
            name: 'Paulo',
            nationality: 'Any nationality',
            partner: 'Any partner',
            placeOfBirth: 'Any place',
            registerId: 'Any id',
            taxId: '3',
            updatedAt: expect.anything(),
            updatedBy: null,
          },
          updatedAt: expect.any(String),
          birthDate: expect.any(String),
          createdAt: expect.any(String),
          emissionDate: expect.any(String),
          initialDate: expect.any(String),
          finalDate: null,
        },
      ],
    });
    expect(response.status).toBe(200);
  });
  it('Should return 200 and empty array when there is no benefit', async () => {
    await global.prismaClient.benefit.deleteMany();

    const response = await global.testRequest
      .get('/benefits')
      .set('x-access-token', token);

    expect(response.body.data).toEqual({
      currentPage: 1,
      data: [],
      totalPages: 1,
      totalResults: 0,
    });
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
