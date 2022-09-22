import { ReferenceObject, SchemaObject } from 'openapi-comment-parser';

export default {
  Role: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        format: 'int32',
        example: '1',
      },
      name: {
        type: 'string',
        example: 'admin',
      },
      description: {
        type: 'string',
        example: 'nível de acesso total',
      },
      updatedBy: {
        type: 'string',
        format: 'nullable',
      },
      createdAt: {
        type: 'string',
        example: '2022-09-03T05:52:56.000Z',
      },
      updatedAt: {
        type: 'string',
        example: '2022-09-22T01:45:27.482Z',
      },
      deletedAt: {
        type: 'string',
        format: 'nullable',
      },
    },
  },
  GetAllRolesResponse: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 200 },
      statusCodeAsString: { type: 'string', example: 'OK' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Role' },
      },
    },
  },
  GetRoleByIdResponse: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 200 },
      statusCodeAsString: { type: 'string', example: 'OK' },
      data: {
        $ref: '#/components/schemas/Role',
      },
    },
  },
  CreateRolePayload: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'test' },
      description: { type: 'string', example: 'test' },
    },
    required: ['name', 'description'],
  },
  CreateRoleResponse: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 201 },
      statusCodeAsString: { type: 'string', example: 'CREATED' },
      data: {
        $ref: '#/components/schemas/Role',
      },
    },
  },
  UpdateRolePayload: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'test' },
      description: { type: 'string', example: 'test' },
    },
  },
} as { [key: string]: SchemaObject | ReferenceObject };
