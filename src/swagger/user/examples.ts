import { ExampleObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  GetAllUsersResponse: {
    value: {
      statusCode: 200,
      statusCodeAsString: 'OK',
      data: [
        {
          id: 1,
          userName: 'afonsobr',
          email: 'brunohafonso@gmail.com',
          name: 'Bruno Afonso',
          status: 'ACTIVE',
          roleId: 1,
          role: {
            id: 1,
            name: 'admin',
            description: 'nível de acesso total',
            updatedBy: 'string',
            createdAt: '2022-09-03T05:52:56.000Z',
            updatedAt: '2022-09-22T01:45:27.482Z',
            deletedAt: 'string',
          },
        },
      ],
    },
  },
  GetUserByUsernameResponse: {
    value: {
      statusCode: 200,
      statusCodeAsString: 'OK',
      data: {
        id: 1,
        userName: 'afonsobr',
        email: 'brunohafonso@gmail.com',
        name: 'Bruno Afonso',
        status: 'ACTIVE',
        roleId: 1,
        role: {
          id: 1,
          name: 'admin',
          description: 'nível de acesso total',
          updatedBy: 'string',
          createdAt: '2022-09-03T05:52:56.000Z',
          updatedAt: '2022-09-22T01:45:27.482Z',
          deletedAt: 'string',
        },
      },
    },
  },
  CreateUserResponse: {
    value: {
      statusCode: 201,
      statusCodeAsString: 'CREATED',
      data: {
        id: 1,
        userName: 'afonsobr',
        email: 'brunohafonso@gmail.com',
        name: 'Bruno Afonso',
        status: 'ACTIVE',
        roleId: 1,
        role: {
          id: 1,
          name: 'admin',
          description: 'nível de acesso total',
          updatedBy: 'string',
          createdAt: '2022-09-03T05:52:56.000Z',
          updatedAt: '2022-09-22T01:45:27.482Z',
          deletedAt: 'string',
        },
      },
    },
  },
} as { [key: string]: ExampleObject | ReferenceObject };
