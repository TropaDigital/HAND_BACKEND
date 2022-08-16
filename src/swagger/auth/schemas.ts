import { SchemaObject, ReferenceObject } from 'openapi-comment-parser';

export default {
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
