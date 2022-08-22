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
          role: 'ADMIN',
          status: 'ACTIVE',
        },
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZm9uc29iciIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTY2MDc3ODcxMCwiZXhwIjoxNjYwNzgyMzEwfQ.IsDZvyZnzVPh7ztYTTC0T6UWI3kmNfnASzfiJFHoImc',
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
