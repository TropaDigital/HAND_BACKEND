import {
  makeAuthServiceStub,
  makeUserRepositoryStub,
} from '../../user/__tests__/helpers/test-helper';
import { AuthService } from '../service';

const makeSut = () => {
  const userRepository = makeUserRepositoryStub();
  const authService = makeAuthServiceStub();
  const sut = new AuthService(userRepository, authService);

  return { sut, userRepository, authService };
};

describe(AuthService.name, () => {
  describe(`When ${AuthService.prototype.authenticate.name} is called`, () => {
    it('Should call repository with right params', async () => {
      const { sut, userRepository } = makeSut();
      const findByUserNameSpy = userRepository.findByUserName;
      const credentials = { login: 'any_user_name', password: 'any_password' };

      await sut.authenticate(credentials);

      expect(findByUserNameSpy).toBeCalledWith('any_user_name');
    });

    it('Should call auth service with right params', async () => {
      const { sut, authService } = makeSut();
      const compareHashSpy = authService.compareHash;
      const credentials = { login: 'any_user_name', password: 'any_password' };

      await sut.authenticate(credentials);

      expect(compareHashSpy).toBeCalledWith('any_password', 'any_password');
    });

    it('Should return correct value', async () => {
      const { sut } = makeSut();
      const credentials = { login: 'any_user_name', password: 'any_password' };

      const result = await sut.authenticate(credentials);

      expect(result).toEqual({
        token: 'any_token',
        user: {
          email: 'any_email@mail.com',
          userName: 'any_user',
          id: 0,
          name: 'any_name',
          role: 'USER',
          status: 'ACTIVE',
        },
      });
    });

    it('Should throw when repository return null value', async () => {
      const { sut, userRepository } = makeSut();
      const credentials = { login: 'any_user_name', password: 'any_password' };
      userRepository.findByUserName.mockResolvedValueOnce(null);

      const promise = sut.authenticate(credentials);

      expect(promise).rejects.toThrowError(new Error('User not authenticated'));
    });

    it('Should throw when repository throws', async () => {
      const { sut, userRepository } = makeSut();
      const credentials = { login: 'any_user_name', password: 'any_password' };
      userRepository.findByUserName.mockRejectedValueOnce(
        new Error('any_repository_error'),
      );

      const promise = sut.authenticate(credentials);

      expect(promise).rejects.toThrowError(new Error('any_repository_error'));
    });

    it('Should throw when auth service throws', async () => {
      const { sut, authService } = makeSut();
      const credentials = { login: 'any_user_name', password: 'any_password' };
      authService.compareHash.mockRejectedValueOnce(
        new Error('any_auth_service_error'),
      );

      const promise = sut.authenticate(credentials);

      expect(promise).rejects.toThrowError(new Error('any_auth_service_error'));
    });

    it('Should throw when auth service returns null', async () => {
      const { sut, authService } = makeSut();
      const credentials = { login: 'any_user_name', password: 'any_password' };
      authService.compareHash.mockResolvedValueOnce(false);

      const promise = sut.authenticate(credentials);

      expect(promise).rejects.toThrowError(new Error('User not authenticated'));
    });
  });
});
