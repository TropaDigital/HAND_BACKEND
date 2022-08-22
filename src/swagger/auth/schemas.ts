import { SchemaObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  AuthResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
      },
      statusCodeAsString: {
        type: 'string',
      },
      data: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
              },
              userName: {
                type: 'string',
              },
              email: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
              role: {
                type: 'string',
              },
              status: {
                type: 'string',
              },
            },
            required: ['id', 'userName', 'email', 'name', 'role', 'status'],
          },
          token: {
            type: 'string',
          },
        },
        required: ['user', 'token'],
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
  AuthenticatePayload: {
    type: 'object',
    properties: {
      login: {
        type: 'string',
        example: 'afonsobr',
        description: 'the user login',
      },
      password: {
        type: 'string',
        example: 'any_pass',
        description: 'the user password',
      },
    },
    required: ['login', 'password'],
  },
  UpdatePasswordPayload: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        example: '132465798',
      },
    },
  },
} as { [key: string]: SchemaObject | ReferenceObject };
