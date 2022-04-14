import { Prisma } from '@prisma/client';

export const makeNotFoundResponse = (description: string): unknown => {
  return {
    code: 'GENERIC_ERROR',
    description,
    statusCode: 404,
    statusCodeAsString: 'NOT_FOUND',
    validationErrors: [],
  };
};

export const makeInvalidParamsResponse = (
  validationErrors: unknown[],
): unknown => {
  return {
    code: 'GENERIC_ERROR',
    description: 'Missing or invalid param',
    statusCode: 400,
    statusCodeAsString: 'BAD_REQUEST',
    validationErrors,
  };
};

export const makeFakeCreateConsultantParams = (
  name = 'Mateus',
): Prisma.ConsultantCreateInput => ({
  name,
  city: 'Any City',
  taxId: '8997845641',
  state: 'Any State',
  createdBy: 'User',
});

export const getFirstDatabaseClient = async (): Promise<void> => {
  const result = await global.prismaClient.Consultant.findMany();
  return result[0].id;
};

export const makeFakeConsultant = (
  name = 'Mateus',
): Prisma.ConsultantCreateInput => ({
  name,
  city: 'Any City',
  taxId: '8997845641',
  state: 'Any State',
  createdBy: 'User',
});

export const populateDatabase = async (): Promise<void> => {
  await global.prismaClient.Consultant.createMany({
    data: [makeFakeConsultant('João'), makeFakeConsultant('Pedro')],
  });
};
