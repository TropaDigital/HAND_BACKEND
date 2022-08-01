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
      .patch(`/associateds/addresses/${id}`)
      .set('x-access-token', token)
      .send(
        makeFakeAddressesParams({
          associatedId: id,
        }),
      );

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
    });
  });

  it('Should return 404 when associated does not exists', async () => {
    const id = 999999;
    const response = await global.testRequest
      .patch(`/associateds/addresses/${id}`)
      .set('x-access-token', token)
      .send(makeFakeAddressesParams({ associatedId: id }));
    expect(response.body).toEqual(
      makeNotFoundResponse('associated not found with provided id'),
    );
    expect(response.status).toBe(404);
  });

  it('Should return 400 when receive invalid params', async () => {
    const id = 1;
    const response = await global.testRequest
      .patch(`/associateds/addresses/${id}`)
      .set('x-access-token', token)
      .send({
        associated: 1,
        bank: 1,
        consultant: 1,
        contractModel: 1,
        financialAssistanceValue: '20',
        installmentNumber: '6',
        installmentValue: '20',
        publicAgency: 1,
        initialDate: 1,
        createdBy: 1,
      });

    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'associatedId',
        friendlyFieldName: 'associatedId',
        message: '"associatedId" is required',
      },
      {
        fieldName: 'addressType',
        friendlyFieldName: 'tipo de endereço',
        message: '"tipo de endereço" is required',
      },
      {
        fieldName: 'postalCode',
        friendlyFieldName: 'cep',
        message: '"cep" is required',
      },
      {
        fieldName: 'street',
        friendlyFieldName: 'logradouro',
        message: '"logradouro" is required',
      },
      {
        fieldName: 'houseNumber',
        friendlyFieldName: 'número',
        message: '"número" is required',
      },
      {
        fieldName: 'district',
        friendlyFieldName: 'bairro',
        message: '"bairro" is required',
      },
      {
        fieldName: 'city',
        friendlyFieldName: 'cidade',
        message: '"cidade" is required',
      },
      {
        fieldName: 'state',
        friendlyFieldName: 'estado',
        message: '"estado" is required',
      },
    ]);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('Should return 200 when receive just one param', async () => {
    const id = 1;

    const response = await global.testRequest
      .patch(`/associateds/addresses/${id}`)
      .set('x-access-token', token)
      .send(makeFakeAddressesParams({ associatedId: 1 }));
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
    });
    expect(response.status).toBe(200);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const id = 1;
    jest
      .spyOn(AssociatedService.prototype, 'upsertAddressById')
      .mockRejectedValueOnce(new Error('updateById unexpected error'));

    const response = await global.testRequest
      .patch(`/associateds/addresses/${id}`)
      .set('x-access-token', token)
      .send(makeFakeAddressesParams({ associatedId: 1 }));
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
