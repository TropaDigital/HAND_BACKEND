import { SchemaObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  User: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        example: '1',
      },
      userName: {
        type: 'string',
        example: 'afonsobr',
      },
      email: {
        type: 'string',
        example: 'brunohafonso@gmail.com',
      },
      name: {
        type: 'string',
        example: 'Bruno Afonso',
      },
      status: {
        type: 'string',
        example: 'ACTIVE',
      },
      roleId: {
        type: 'number',
        example: '1',
      },
      role: { $ref: '#/components/schemas/Role' },
    },
  },
  GetAllUsersResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: '200',
      },
      statusCodeAsString: {
        type: 'string',
        example: 'OK',
      },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/User' },
      },
    },
  },
  GetUserByUsernameResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: '200',
      },
      statusCodeAsString: {
        type: 'string',
        example: 'OK',
      },
      data: { $ref: '#/components/schemas/User' },
    },
  },
  CreateUserPayload: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        example: 'brunohafonso8@gmail.com',
      },
      userName: {
        type: 'string',
        example: 'afonsobr2',
      },
      name: {
        type: 'string',
        example: 'Bruno Afonso',
      },
      password: {
        type: 'string',
        example: '123465789',
      },
    },
    required: ['email', 'password', 'name', 'userName'],
  },
  UpdateUserByIdPayload: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        example: 'brunohafonso8@gmail.com',
      },
      userName: {
        type: 'string',
        example: 'afonsobr2',
      },
      name: {
        type: 'string',
        example: 'Bruno Afonso',
      },
      password: {
        type: 'string',
        example: '123465789',
      },
      status: {
        type: 'string',
        example: 'ACTIVE',
        enum: ['ACTIVE', 'INACTIVE'],
      },
    },
    required: ['email', 'password', 'name', 'userName'],
  },
  CreateUserResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: '201',
      },
      statusCodeAsString: {
        type: 'string',
        example: 'CREATED',
      },
      data: { $ref: '#/components/schemas/User' },
    },
  },
} as { [key: string]: SchemaObject | ReferenceObject };
