import { ExampleObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  GetAllAffiliationsResponse: {
    value: {
      statusCode: 200,
      statusCodeAsString: 'OK',
      data: [
        {
          id: 1,
          name: 'ASES Vitória',
          createdAt: '2022-10-05T02:01:32.000Z',
          updatedAt: '2022-10-07T01:03:17.306Z',
          deletedAt: null,
        },
        {
          id: 2,
          name: 'ASES Colatina',
          createdAt: '2022-10-05T02:01:32.000Z',
          updatedAt: '2022-10-07T01:03:17.306Z',
          deletedAt: null,
        },
        {
          id: 3,
          name: 'ASES Cachoeiro',
          createdAt: '2022-10-05T02:01:32.000Z',
          updatedAt: '2022-10-07T01:03:17.306Z',
          deletedAt: null,
        },
      ],
    },
  },
  GetAffiliationByIdResponse: {
    value: {
      statusCode: 200,
      statusCodeAsString: 'OK',
      data: {
        id: 1,
        name: 'ASES Vitória',
        createdAt: '2022-10-05T02:01:32.000Z',
        updatedAt: '2022-10-07T01:03:17.306Z',
        deletedAt: null,
      },
    },
  },
  CreateAffiliationResponse: {
    value: {
      statusCode: 201,
      statusCodeAsString: 'CREATED',
      data: {
        id: 4,
        name: 'ASES São Paulo',
        createdAt: '2022-10-07T02:09:02.000Z',
        updatedAt: '2022-10-07T02:09:02.377Z',
        deletedAt: null,
      },
    },
  },
} as { [key: string]: ExampleObject | ReferenceObject };
