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

export const makeFakeUser = (
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

export const populateDatabase = async (): Promise<void> => {
  await global.prismaClient.user.deleteMany({});
  await global.prismaClient.user.createMany({
    data: [
      makeFakeUser({
        name: 'João',
        id: 1,
        userName: 'joao',
        email: 'joao@mail.com',
        password:
          '$2a$12$e.3b/dnS4Ydw9Y8pTF1Gm.YOkTZbe5ELtcE4Sp6W93Pzwrt3Lg8Wa',
      }),
      makeFakeUser({
        name: 'Pedro',
        userName: 'pedro',
        id: 2,
        email: 'pedro@mail.com',
        password:
          '$2a$12$e.3b/dnS4Ydw9Y8pTF1Gm.YOkTZbe5ELtcE4Sp6W93Pzwrt3Lg8Wa',
      }),
    ],
  });
};
