import { ExampleObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  InvalidCredentialsResponse: {
    value: {
      code: 'INVALID_CREDENTIALS',
      statusCode: 401,
      statusCodeAsString: 'UNAUTHORIZED',
      description: 'invalid credentials',
    },
  },
  AuthenticatedUserResponse: {
    value: {
      statusCode: 200,
      statusCodeAsString: 'OK',
      data: {
        id: 1,
        userName: 'afonsobr',
        email: 'brunohafonso@gmail.com',
        name: 'Bruno Afonso',
        status: 'ACTIVE',
        roleId: 1,
        role: {
          id: 1,
          name: 'admin',
          description: 'nível de acesso total',
          updatedBy: null,
          createdAt: '2022-09-06T03:15:13.000Z',
          updatedAt: '2022-10-04T23:46:09.301Z',
          deletedAt: null,
        },
      },
    },
  },
  AuthSuccessResponse: {
    value: {
      statusCode: 200,
      statusCodeAsString: 'OK',
      data: {
        user: {
          id: 1,
          userName: 'afonsobr',
          email: 'brunohafonso@gmail.com',
          name: 'Bruno Afonso',
          status: 'ACTIVE',
          roleId: 1,
          role: {
            id: 1,
            name: 'admin',
            description: 'nível de acesso total',
            updatedBy: null,
            createdAt: '2022-09-06T03:15:13.000Z',
            updatedAt: '2022-10-04T22:39:29.222Z',
            deletedAt: null,
          },
        },
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZm9uc29iciIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY2NDkyNTc5MCwiZXhwIjoxNjY0OTYxNzkwfQ.20uQF0ODIBz9Mj3ymCwhq7NNGis16IO_1CuPf-jtCkA',
      },
    },
  },
  EmailDoesNotExists: {
    value: {
      code: 'FORGOT_PASSWORD_EMAIL_DOES_NOT_EXISTS',
      statusCode: 404,
      statusCodeAsString: 'NOT_FOUND',
      description: 'user not found with the provided email',
      validationErrors: [],
    },
  },
  TokenInvalid: {
    value: {
      code: 'FORGOT_PASSWORD_INVALID_TOKEN',
      statusCode: 401,
      statusCodeAsString: 'UNAUTHORIZED',
      description: 'the provided token is not valid',
      validationErrors: [],
    },
  },
} as { [key: string]: ExampleObject | ReferenceObject };
