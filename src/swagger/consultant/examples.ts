import { ExampleObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  CreateConsultantResponse: {
    value: {
      statusCode: 201,
      statusCodeAsString: 'CREATED',
      data: {
        id: 1,
        name: 'Jane Doe',
        taxId: '1020312465',
        city: 'São Luis',
        state: 'Maranhão',
        commission: 1000,
        createdBy: 'afonsobr',
        updatedBy: null,
        createdAt: '2022-09-22T00:54:40.000Z',
        updatedAt: '2022-09-22T00:54:40.496Z',
        deletedAt: null,
      },
    },
  },
  GetConsultantByIdResponse: {
    value: {
      status: 200,
      statusCodeAsString: 'OK',
      data: {
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
  },
  GetAllConsultantsResponse: {
    value: {
      status: 200,
      statusCodeAsString: 'OK',
      data: [
        {
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
      ],
    },
  },
  CreateConsultantBadRequestResponse: {
    value: {
      code: 'MISSING_OR_INVALID_PARAMETERS',
      statusCode: 400,
      statusCodeAsString: 'BAD_REQUEST',
      description: 'Missing or invalid param',
      validationErrors: [
        {
          fieldName: 'name',
          friendlyFieldName: 'name',
          message: '"name" is required',
        },
        {
          fieldName: 'taxId',
          friendlyFieldName: 'taxId',
          message: '"taxId" is required',
        },
        {
          fieldName: 'city',
          friendlyFieldName: 'city',
          message: '"city" is required',
        },
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
