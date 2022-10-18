import { ReferenceObject, SchemaObject } from 'openapi-comment-parser';

export default {
  GetAllAffiliationsResponse: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 200 },
      statusCodeAsString: { type: 'string', example: 'OK' },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Affiliation',
        },
      },
    },
  },
  GetAffiliationByIdResponse: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 200 },
      statusCodeAsString: { type: 'string', example: 'OK' },
      data: {
        $ref: '#/components/schemas/Affiliation',
      },
    },
  },
  CreateAffiliationResponse: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 201 },
      statusCodeAsString: { type: 'string', example: 'CREATED' },
      data: {
        $ref: '#/components/schemas/Affiliation',
      },
    },
  },
  CreateAffiliationPayload: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'ASES Vitória',
      },
    },
    required: ['name'],
  },
  UpdateAffiliationByIdPayload: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'ASES Vitória',
      },
    },
  },
  Affiliation: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        example: '1',
      },
      name: {
        type: 'string',
        example: 'ASES Vitória',
      },
      createdAt: {
        type: 'string',
        example: '2022-10-05T02:01:32.000Z',
      },
      updatedAt: {
        type: 'string',
        example: '2022-10-07T01:03:17.306Z',
      },
      deletedAt: {
        type: 'string',
        format: 'nullable',
      },
    },
  },
} as { [key: string]: SchemaObject | ReferenceObject };
