import { AssociatedService } from '../../../src/modules/associated/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
} from '../helpers';
import { populateDatabase as populateUsersDatabase } from '../users/helpers';
import { makeFakeAddressesParams, populateDatabase } from './helpers';

describe('PATCH /associateds/addresses/{id} - Update associated by id', () => {
  const token = new AuthenticationService().generateToken({
    sub: 'Any User',
    role: 'VALID_ROLE',
  });

  beforeAll(async () => {
    await populateUsersDatabase();
    await global.prismaClient.associated.deleteMany();
    await global.prismaClient.address.deleteMany();
    await global.prismaClient.employmentRelationship.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.associated.deleteMany();
    await global.prismaClient.address.deleteMany();
    await global.prismaClient.employmentRelationship.deleteMany();
  });

  it('Should return 200 with updated', async () => {
    const id = 1;

    const response = await global.testRequest
      .patch(`/associateds/${id}/addresses/${id}`)
      .set('x-access-token', token)
      .send(makeFakeAddressesParams());

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      addressType: 'any_type',
      associatedId: 1,
      city: 'any_city',
      complement: 'any_complements',
      district: 'any_district',
      houseNumber: 'any_number',
      id: expect.any(Number),
      postalCode: 'any_postal_code',
      state: 'any_state',
      street: 'any_street',
      isDefault: false,
    });
  });

  it('Should return 404 when associated does not exists', async () => {
    const id = 999999;
    const response = await global.testRequest
      .patch(`/associateds/${id}/addresses/${id}`)
      .set('x-access-token', token)
      .send(makeFakeAddressesParams());
    expect(response.body).toEqual(
      makeNotFoundResponse('associated not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const id = 1;
    const response = await global.testRequest
      .patch(`/associateds/${id}/addresses/${id}`)
      .set('x-access-token', token)
      .send({
        addressType: 0,
        city: 0,
        complement: 0,
        district: 0,
        houseNumber: 0,
        postalCode: 0,
        state: 0,
        street: 0,
        isDefault: false,
      });

    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'addressType',
        friendlyFieldName: 'tipo de endereço',
        message: '"tipo de endereço" must be a string',
      },
      {
        fieldName: 'postalCode',
        friendlyFieldName: 'cep',
        message: '"cep" must be a string',
      },
      {
        fieldName: 'street',
        friendlyFieldName: 'logradouro',
        message: '"logradouro" must be a string',
      },
      {
        fieldName: 'houseNumber',
        friendlyFieldName: 'número',
        message: '"número" must be a string',
      },
      {
        fieldName: 'complement',
        friendlyFieldName: 'complemento',
        message: '"complemento" must be a string',
      },
      {
        fieldName: 'district',
        friendlyFieldName: 'bairro',
        message: '"bairro" must be a string',
      },
      {
        fieldName: 'city',
        friendlyFieldName: 'cidade',
        message: '"cidade" must be a string',
      },
      {
        fieldName: 'state',
        friendlyFieldName: 'estado',
        message: '"estado" must be a string',
      },
    ]);

    expect(response.body).toEqual(invalidParamsResponse);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
  });

  it('Should return 200 when receive just one param', async () => {
    const id = 1;

    const response = await global.testRequest
      .patch(`/associateds/${id}/addresses/${id}`)
      .set('x-access-token', token)
      .send(makeFakeAddressesParams());
    expect(response.body.data).toEqual({
      addressType: 'any_type',
      associatedId: 1,
      city: 'any_city',
      complement: 'any_complements',
      district: 'any_district',
      houseNumber: 'any_number',
      id: expect.any(Number),
      postalCode: 'any_postal_code',
      state: 'any_state',
      street: 'any_street',
      isDefault: false,
    });
    expect(response.status).toBe(200);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const id = 1;
    jest
      .spyOn(AssociatedService.prototype, 'upsertAddressById')
      .mockRejectedValueOnce(new Error('updateById unexpected error'));

    const response = await global.testRequest
      .patch(`/associateds/${id}/addresses/${id}`)
      .set('x-access-token', token)
      .send(makeFakeAddressesParams());
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
