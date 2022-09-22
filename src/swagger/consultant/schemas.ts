import { SchemaObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  CreateConsultantPayload: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Jane Doe' },
      taxId: { type: 'string', example: 1020312465 },
      city: { type: 'string', example: 'São Luis' },
      state: { type: 'string', example: 'Maranhão' },
      commission: { type: 'integer', format: 'int32', example: 10 },
    },
  },
  CreateConsultantResponse: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 201 },
      statusCodeAsString: { type: 'string', example: 'OK' },
      data: {
        $ref: '#/components/schemas/Consultant',
      },
    },
  },
  GetConsultantByIdResponse: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 200 },
      statusCodeAsString: { type: 'string', example: 'OK' },
      data: {
        $ref: '#/components/schemas/Consultant',
      },
    },
  },
  GetAllConsultantsResponse: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 200 },
      statusCodeAsString: { type: 'string', example: 'OK' },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Consultant',
        },
      },
    },
  },
  UpdateConsultantPayload: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Jane Doe' },
      taxId: { type: 'string', example: 1020312465 },
      city: { type: 'string', example: 'São Luis' },
      state: { type: 'string', example: 'Maranhão' },
      commission: { type: 'integer', format: 'int32', example: 10 },
    },
  },
  UpdateConsultantResponse: {
    type: 'object',
    properties: { message: { type: 'string', example: 'No Content' } },
  },

  ConsultantBadRequestResponse: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
      },
      statusCode: {
        type: 'number',
      },
      statusCodeAsString: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      validationErrors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fieldName: {
              type: 'string',
            },
            friendlyFieldName: {
              type: 'string',
            },
            message: {
              type: 'string',
            },
          },
          required: ['fieldName', 'friendlyFieldName', 'message'],
        },
      },
    },
    required: [
      'code',
      'statusCode',
      'statusCodeAsString',
      'description',
      'validationErrors',
    ],
  },
  Consultant: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'String' },
      taxId: { type: 'string', example: 1020312465 },
      city: { type: 'string', example: 'São Luis' },
      state: { type: 'string', example: 'Maranhão' },
      commission: { type: 'integer', format: 'int32', example: 10 },
      createdBy: { type: 'string', example: 'admin' },
      updatedBy: { type: 'string', example: 'admin' },
      createdAt: { type: 'string', example: '10-10-2020' },
      updatedAt: { type: 'string', example: '20-03-2021' },
      deletedAt: { type: 'string', example: '03-09-2022' },
    },
  },
} as { [key: string]: SchemaObject | ReferenceObject };
