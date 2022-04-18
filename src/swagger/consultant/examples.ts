import { ExampleObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  CreateConsultantResponse: {
    value: {
      name: 'String',
      taxId: 1020312465,
      city: 'São Luis',
      state: 'Maranhão',
      commission: 10,
      createdBy: 'admin',
      updatedBy: 'admin',
      createdAt: '10-10-2020',
      updatedAt: '20-03-2021',
      deletedAt: '03-09-2022',
    },
  },
  ConsultantResponse: {
    value: {
      name: 'John Doe',
      taxId: 1020312465,
      city: 'São Luis',
      state: 'Maranhão',
      commission: 10,
      createdBy: 'admin',
      updatedBy: 'admin',
      createdAt: '10-10-2020',
      updatedAt: '20-03-2021',
      deletedAt: '03-09-2022',
    },
  },
  ConsultantBadRequestResponse: {
    value: {
      code: 'GENERIC_ERROR',
      statusCode: 400,
      statusCodeAsString: 'BAD_REQUEST',
      description: 'Missing or invalid param',
      validationErrors: [
        {
          fieldName: 'state',
          friendlyFieldName: 'state',
          message: '"state" is required',
        },
        {
          fieldName: 'createdBy',
          friendlyFieldName: 'createdBy',
          message: '"createdBy" is required',
        },
      ],
    },
  },
} as { [key: string]: ExampleObject | ReferenceObject };
