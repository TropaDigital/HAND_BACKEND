import { ExampleObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  GetAllRolesResponse: {
    value: {
      statusCode: 200,
      statusCodeAsString: 'OK',
      data: [
        {
          id: 1,
          name: 'admin',
          description: 'nível de acesso total',
          updatedBy: null,
          createdAt: '2022-09-03T05:52:56.000Z',
          updatedAt: '2022-09-22T01:45:27.482Z',
          deletedAt: null,
        },
        {
          id: 2,
          name: 'operational',
          description: 'nível de acesso limitado',
          updatedBy: null,
          createdAt: '2022-09-03T05:52:56.000Z',
          updatedAt: '2022-09-22T01:45:27.482Z',
          deletedAt: null,
        },
      ],
    },
  },
  GetRoleByIdResponse: {
    value: {
      statusCode: 200,
      statusCodeAsString: 'OK',
      data: {
        id: 1,
        name: 'admin',
        description: 'nível de acesso total',
        updatedBy: null,
        createdAt: '2022-09-03T05:52:56.000Z',
        updatedAt: '2022-09-22T01:45:27.482Z',
        deletedAt: null,
      },
    },
  },
  CreateRoleBadRequestResponse: {
    value: {
      code: 'MISSING_OR_INVALID_PARAMETERS',
      statusCode: 400,
      statusCodeAsString: 'BAD_REQUEST',
      description: 'Missing or invalid param',
      validationErrors: [
        {
          fieldName: 'name',
          friendlyFieldName: 'name',
          message: '"name" is required',
        },
        {
          fieldName: 'description',
          friendlyFieldName: 'description',
          message: '"description" is required',
        },
      ],
    },
  },
  CreateRoleResponse: {
    value: {
      statusCode: 201,
      statusCodeAsString: 'CREATED',
      data: {
        id: 3,
        name: 'test',
        description: 'test',
        updatedBy: null,
        createdAt: '2022-09-22T02:28:26.000Z',
        updatedAt: '2022-09-22T02:28:25.654Z',
        deletedAt: null,
      },
    },
  },
} as { [key: string]: ExampleObject | ReferenceObject };
