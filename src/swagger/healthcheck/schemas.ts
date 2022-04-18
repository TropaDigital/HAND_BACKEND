import { SchemaObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  HealthcheckResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
        description: 'http status code',
      },
      statusCodeAsString: {
        type: 'string',
        description: 'http status code as string',
      },
      data: {
        type: 'object',
        description: 'an object with the response',
        properties: {
          name: { type: 'string' },
          version: { type: 'string', description: 'application version' },
          uptime: {
            type: 'string',
            description: 'time that the application is running',
          },
          status: {
            type: 'string',
            description: 'status of the application',
            enum: ['healthly', 'unhealthy'],
          },
          database: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                description: 'status of the database',
                enum: ['healthly', 'unhealthy'],
              },
              connectionStatus: {
                type: 'string',
                description: 'status of the database connection',
                enum: ['connected', 'disconnected'],
              },
            },
          },
        },
      },
    },
  },
} as { [key: string]: SchemaObject | ReferenceObject };
