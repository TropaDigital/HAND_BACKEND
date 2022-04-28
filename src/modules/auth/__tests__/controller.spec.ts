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
  const sut = new AuthController(loginServiceStub, validatorStub);

  return { sut, loginServiceStub, validatorStub };
};

describe(AuthController.name, () => {
  describe(AuthController.prototype.login.name, () => {
    it('Should return value when method is called', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.login(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', {
          login: 'any_email@mail.com',
          token: 'any_token',
        }),
      );
    });
  });
});
