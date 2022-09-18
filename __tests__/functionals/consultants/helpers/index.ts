import { Consultant, Prisma } from '@prisma/client';

export const makeFakeCreateConsultantParams = (
  payload?: Partial<Consultant>,
): Prisma.ConsultantCreateInput => ({
  name: 'Mateus',
  city: 'Any City',
  taxId: `8997845641${payload?.id || ''}`,
  state: 'Any State',
  createdBy: 'User',
  ...payload,
});

export const makeFakeConsultant = (
  payload?: Partial<Consultant>,
): Prisma.ConsultantCreateInput => ({
  name: 'Mateus',
  city: 'Any City',
  taxId: `8997845641${payload?.id || ''}`,
  state: 'Any State',
  createdBy: 'User',
  commission: 0,
  ...payload,
});

export const populateDatabase = async (): Promise<void> => {
  await global.prismaClient.consultant.deleteMany({});
  await global.prismaClient.consultant.createMany({
    data: [
      makeFakeConsultant({ name: 'João', id: 1 }),
      makeFakeConsultant({ name: 'Pedro', id: 2 }),
    ],
  });
};
