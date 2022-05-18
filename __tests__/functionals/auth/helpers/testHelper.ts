import { IAuthRequestParams } from '../../../../src/modules/auth/interfaces';

export const makeFakeLoginParams = (
  payload?: Partial<IAuthRequestParams>,
): IAuthRequestParams => ({
  login: 'joao',
  password: 'any_password',
  ...payload,
});
