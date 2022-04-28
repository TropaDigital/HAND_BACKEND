import { IAuthRequestParams } from '../../../../src/modules/auth/interfaces';
import { makeFakeUser } from '../../../../src/modules/user/__tests__/helpers/test-helper';

export const makeFakeLoginParams = (
  payload?: Partial<IAuthRequestParams>,
): IAuthRequestParams => ({
  login: 'joao@mail.com',
  password: 'any_password',
  ...payload,
});

export const populateDatabase = async (): Promise<void> => {
  await global.prismaClient.user.deleteMany({});
  await global.prismaClient.user.createMany({
    data: [
      makeFakeUser({
        name: 'João',
        id: 1,
        email: 'joao@mail.com',
        password:
          '$2a$12$e.3b/dnS4Ydw9Y8pTF1Gm.YOkTZbe5ELtcE4Sp6W93Pzwrt3Lg8Wa',
      }),
      makeFakeUser({
        name: 'Pedro',
        id: 2,
        email: 'pedro@mail.com',
        password:
          '$2a$12$e.3b/dnS4Ydw9Y8pTF1Gm.YOkTZbe5ELtcE4Sp6W93Pzwrt3Lg8Wa',
      }),
    ],
  });
};
