import { SchemaObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  UnauthorizedResponse: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        example: 'GENERIC_ERROR',
        description: 'internal code of the error',
      },
      statusCode: {
        type: 'number',
        example: 401,
        description: 'status code of the response',
      },
      statusCodeAsString: {
        type: 'string',
        example: 'UNAUTHORIZED',
        description: 'status code as string of the response',
      },
      description: {
        type: 'string',
        example: 'token not provided',
        description: 'error description',
      },
    },
    required: ['code', 'statusCode', 'statusCodeAsString', 'description'],
    additionalProperties: false,
  },
  TooManyRequestsResponse: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        example: 'GENERIC_ERROR',
        description: 'internal code of the error',
      },
      statusCode: {
        type: 'number',
        example: 429,
        description: 'status code of the response',
      },
      statusCodeAsString: {
        type: 'string',
        example: 'TOO_MANY_REQUESTS',
        description: 'status code as string of the response',
      },
      description: {
        type: 'string',
        example: 'you reach the limit of requests for this resource',
        description: 'error description',
      },
    },
    required: ['code', 'statusCode', 'statusCodeAsString', 'description'],
    additionalProperties: false,
  },
  ForbiddenResponse: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        example: 'GENERIC_ERROR',
        description: 'internal code of the error',
      },
      statusCode: {
        type: 'number',
        example: 403,
        description: 'status code of the response',
      },
      statusCodeAsString: {
        type: 'string',
        example: 'FORBIDDEN',
        description: 'status code as string of the response',
      },
      description: {
        type: 'string',
        example: 'you dont have permission to access this resource',
        description: 'error description',
      },
    },
    required: ['code', 'statusCode', 'statusCodeAsString', 'description'],
    additionalProperties: false,
  },
  NotFoundResponse: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        example: 'GENERIC_ERROR',
        description: 'internal code of the error',
      },
      statusCode: {
        type: 'number',
        example: 404,
        description: 'status code of the response',
      },
      statusCodeAsString: {
        type: 'string',
        example: 'NOT_FOUND',
        description: 'status code as string of the response',
      },
      description: {
        type: 'string',
        example: 'Resource not found',
        description: 'error description',
      },
    },
    required: ['code', 'statusCode', 'statusCodeAsString', 'description'],
    additionalProperties: false,
  },
  InternalServerErrorResponse: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        example: 'GENERIC_ERROR',
        description: 'internal code of the error',
      },
      statusCode: {
        type: 'number',
        example: 500,
        description: 'status code of the response',
      },
      statusCodeAsString: {
        type: 'string',
        example: 'INTERNAL_SERVER_ERROR',
        description: 'status code as string of the response',
      },
      description: {
        type: 'string',
        example: 'Internal Server Error',
        description: 'error description',
      },
    },
    required: ['code', 'statusCode', 'statusCodeAsString', 'description'],
    additionalProperties: false,
  },
  ValidationError: {
    type: 'object',
    properties: {
      fieldName: {
        type: 'string',
        description: 'name of the field',
      },
      friendlyFieldName: {
        type: 'string',
        description: 'friendly name of the field',
      },
      message: {
        type: 'string',
        description: 'message with the description of validation',
      },
    },
  },
} as { [key: string]: SchemaObject | ReferenceObject };
