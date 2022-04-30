import { User, Prisma } from '@prisma/client';

export const makeFakeCreateUserParams = (
  payload?: Partial<User>,
): Prisma.UserCreateInput => ({
  email: 'any@mail.com',
  userName: 'any_user_name',
  name: 'Mateus',
  password: 'any_password',
  status: 'ACTIVE',
  role: 'USER',
  ...payload,
});
