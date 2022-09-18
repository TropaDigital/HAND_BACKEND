import { NotFoundError } from '../../../shared/errors';
import { makeUserServiceStub } from '../../user/__tests__/helpers/test-helper';
import { AuthController } from '../controller';
import {
  makeFakeApiHttpRequest,
  makeFakeApiHttpResponse,
  makeLoginServiceStub,
  makeValidatorStub,
} from './helpers/test-helper';

const makeSut = () => {
  const loginServiceStub = makeLoginServiceStub();
  const validatorStub = makeValidatorStub();
  const userService = makeUserServiceStub();
  const sut = new AuthController(loginServiceStub, userService, validatorStub);

  return { sut, loginServiceStub, validatorStub, userService };
};

describe(AuthController.name, () => {
  describe(AuthController.prototype.login.name, () => {
    it('Should return value when method is called', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.login(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', {
          login: 'any_user_name',
          token: 'any_token',
        }),
      );
    });
  });

  describe(AuthController.prototype.me.name, () => {
    it('Should return value when method is called', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        params: { id: 777 },
        user: {
          sub: 'User',
          role: 'USER',
        },
      });

      const result = await sut.me(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', {
          email: 'any_email@mail.com',
          userName: 'any_user',
          id: 0,
          name: 'any_name',
          role: null,
          roleId: 1,
          status: 'ACTIVE',
        }),
      );
    });

    it('Should throw an unuthorized error ', async () => {
      const { sut, userService } = makeSut();
      userService.getByUserName.mockResolvedValueOnce(null);
      const httpRequest = makeFakeApiHttpRequest({
        params: { id: 777 },
        user: {
          sub: 'User',
          role: 'USER',
        },
      });

      await expect(sut.me(httpRequest)).rejects.toThrow(
        new NotFoundError('User not found'),
      );
    });
  });
});
