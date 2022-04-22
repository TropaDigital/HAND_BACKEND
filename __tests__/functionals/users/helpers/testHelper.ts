import { User, Prisma } from '@prisma/client';

export const makeFakeCreateUserParams = (
  payload?: Partial<User>,
): Prisma.UserCreateInput => ({
  name: 'Mateus',
  city: 'Any City',
  taxId: '8997845641',
  state: 'Any State',
  createdBy: 'User',
  ...payload,
});

export const makeFakeUser = (
  payload?: Partial<User>,
): Prisma.UserCreateInput => ({
  name: 'Mateus',
  city: 'Any City',
  taxId: '8997845641',
  state: 'Any State',
  createdBy: 'User',
  ...payload,
});

export const populateDatabase = async (): Promise<void> => {
  await global.prismaClient.user.createMany({
    data: [
      makeFakeUser({ name: 'João', id: 1 }),
      makeFakeUser({ name: 'Pedro', id: 2 }),
    ],
  });
};
