import { ExampleObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  EmailDoesNotExists: {
    value: {
      code: 'FORGOT_PASSWORD_EMAIL_DOES_NOT_EXISTS',
      statusCode: 404,
      statusCodeAsString: 'NOT_FOUND',
      description: 'user not found with the provided email',
      validationErrors: [],
    },
  },
} as { [key: string]: ExampleObject | ReferenceObject };
