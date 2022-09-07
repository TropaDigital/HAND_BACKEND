import { AssociatedService } from '../../../src/modules/associated/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
} from '../helpers';
import { populateDatabase } from '../users/helpers';
import { makeFakeCreateAssociatedParams } from './helpers';

describe('POST /associateds - Create new associated', () => {
  const token = new AuthenticationService().generateToken({
    sub: 'Any User',
    role: 'VALID_ROLE',
  });

  beforeAll(async () => {
    await global.prismaClient.associated.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.associated.deleteMany();
  });

  it('Should return 201 with created associated', async () => {
    const params = makeFakeCreateAssociatedParams();

    const response = await global.testRequest
      .post(`/associateds`)
      .set('x-access-token', token)
      .set('user', JSON.stringify({ sub: 'Any User' }))
      .send(params);

    const result = response.body.data;
    expect(result.name).toEqual(params.name);
    expect(result.addresses[0].street).toEqual(params.addresses[0].street);
    expect(response.status).toBe(201);
  });

  it('Should return 400 when receive invalid params', async () => {
    const params = {
      name: 'Vinicius',
      city: 'Fortaleza',
      taxId: '784541231',
    };

    const response = await global.testRequest
      .post(`/associateds`)
      .set('x-access-token', token)
      .set('user', JSON.stringify({ sub: 'Any User' }))
      .send(params);
    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'lastName',
        friendlyFieldName: 'sobrenome',
        message: '"sobrenome" is required',
      },
      {
        fieldName: 'gender',
        friendlyFieldName: 'sexo',
        message: '"sexo" is required',
      },
      {
        fieldName: 'birthDate',
        friendlyFieldName: 'birthDate',
        message: '"birthDate" is required',
      },
      {
        fieldName: 'maritalStatus',
        friendlyFieldName: 'estado-civil',
        message: '"estado-civil" is required',
      },
      {
        fieldName: 'nationality',
        friendlyFieldName: 'nacionalidade',
        message: '"nacionalidade" is required',
      },
      {
        fieldName: 'placeOfBirth',
        friendlyFieldName: 'naturalidade',
        message: '"naturalidade" is required',
      },
      {
        fieldName: 'taxId',
        friendlyFieldName: 'cpf',
        message: '"cpf" length must be at least 14 characters long',
      },
      {
        fieldName: 'registerId',
        friendlyFieldName: 'rg',
        message: '"rg" is required',
      },
      {
        fieldName: 'emissionState',
        friendlyFieldName: 'estado-emissor',
        message: '"estado-emissor" is required',
      },
      {
        fieldName: 'issuingAgency',
        friendlyFieldName: 'orgao-emissor',
        message: '"orgao-emissor" is required',
      },
      {
        fieldName: 'emissionDate',
        friendlyFieldName: 'data-emissao',
        message: '"data-emissao" is required',
      },
      {
        fieldName: 'cellPhone',
        friendlyFieldName: 'celular',
        message: '"celular" is required',
      },
      {
        fieldName: 'email',
        friendlyFieldName: 'email',
        message: '"email" is required',
      },
      {
        fieldName: 'father',
        friendlyFieldName: 'pai',
        message: '"pai" is required',
      },
      {
        fieldName: 'mother',
        friendlyFieldName: 'mãe',
        message: '"mãe" is required',
      },
      {
        fieldName: 'affiliations',
        friendlyFieldName: 'affiliations',
        message: '"affiliations" is required',
      },
      {
        fieldName: 'addresses',
        friendlyFieldName: 'addresses',
        message: '"addresses" is required',
      },
      {
        fieldName: 'employmentRelationships',
        friendlyFieldName: 'employmentRelationships',
        message: '"employmentRelationships" is required',
      },
    ]);

    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('Should return 500 when the service throws an exception error', async () => {
    const params = makeFakeCreateAssociatedParams();
    jest
      .spyOn(AssociatedService.prototype, 'create')
      .mockRejectedValueOnce(new Error('create unexpected error'));

    const response = await global.testRequest
      .post(`/associateds`)
      .set('x-access-token', token)
      .set('user', JSON.stringify({ sub: 'Any User' }))
      .send(params);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();

    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
