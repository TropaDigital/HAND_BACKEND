import { User, Prisma } from '@prisma/client';

export const makeFakeCreateUserParams = (
  payload?: Partial<User>,
): Prisma.UserCreateInput => ({
  email: 'any@mail.com',
  name: 'Mateus',
  password: 'any_password',
  status: 'ACTIVE',
  role: 'DEFAULT',
  ...payload,
});

export const makeFakeUser = (
  payload?: Partial<User>,
): Prisma.UserCreateInput => ({
  email: 'any@mail.com',
  name: 'Mateus',
  password: 'any_password',
  status: 'ACTIVE',
  role: 'DEFAULT',
  ...payload,
});

export const populateDatabase = async (): Promise<void> => {
  await global.prismaClient.user.createMany({
    data: [
      makeFakeUser({ name: 'João', id: 1, email: 'joao@mail.com' }),
      makeFakeUser({ name: 'Pedro', id: 2, email: 'pedro@mail.com' }),
    ],
  });
};
