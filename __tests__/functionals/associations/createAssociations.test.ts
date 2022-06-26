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

    expect(response.body.data).toEqual(
      expect.objectContaining({
        ...params,
        emissionDate: '2022-10-10T00:00:00.000Z',
        birthDate: '2022-10-10T00:00:00.000Z',
      }),
    );
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
        fieldName: 'affiliation',
        friendlyFieldName: 'afiliação',
        message: '"afiliação" is required',
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
        fieldName: 'occupation',
        friendlyFieldName: 'profissão',
        message: '"profissão" is required',
      },
      {
        fieldName: 'salary',
        friendlyFieldName: 'salário',
        message: '"salário" is required',
      },
      {
        fieldName: 'paymentDay',
        friendlyFieldName: 'dia de pagamento',
        message: '"dia de pagamento" is required',
      },
      {
        fieldName: 'registerNumber',
        friendlyFieldName: 'matrícula',
        message: '"matrícula" is required',
      },
      {
        fieldName: 'contractType',
        friendlyFieldName: 'tipo de contrato',
        message: '"tipo de contrato" is required',
      },
      {
        fieldName: 'publicAgency',
        friendlyFieldName: 'órgão público',
        message: '"órgão público" is required',
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
        fieldName: 'state',
        friendlyFieldName: 'estado',
        message: '"estado" is required',
      },
      {
        fieldName: 'bank',
        friendlyFieldName: 'banco',
        message: '"banco" is required',
      },
      {
        fieldName: 'agency',
        friendlyFieldName: 'agencia',
        message: '"agencia" is required',
      },
      {
        fieldName: 'accountType',
        friendlyFieldName: 'tipo de conta',
        message: '"tipo de conta" is required',
      },
      {
        fieldName: 'accountNumber',
        friendlyFieldName: 'número da conta',
        message: '"número da conta" is required',
      },
      {
        fieldName: 'pixKey',
        friendlyFieldName: 'chave pix',
        message: '"chave pix" is required',
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
