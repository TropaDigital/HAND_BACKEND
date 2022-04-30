import { User } from '@prisma/client';

import { NotFoundError } from '../../../shared/errors';
import { UserService } from '../service';
import {
  makeUserRepositoryStub,
  makeFakeUser,
  makeFakeCreateUserInput,
  makeFakeUpdateUserInput,
  makeAuthServiceStub,
} from './helpers/test-helper';

const makeSut = () => {
  const userRepository = makeUserRepositoryStub();
  const authService = makeAuthServiceStub();
  const sut = new UserService(userRepository, authService);

  return { sut, userRepository };
};

describe(UserService.name, () => {
  describe(`When ${UserService.prototype.getAll.name} is called`, () => {
    it('should call repository with right params', async () => {
      const { sut, userRepository } = makeSut();
      const findAllSpy = userRepository.findAll;

      await sut.getAll();

      expect(findAllSpy).toBeCalledWith();
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getAll();

      expect(result).toEqual([
        {
          email: 'any_email@mail.com',
          userName: 'any_user',
          id: 0,
          name: 'any_name',
          role: 'USER',
          status: 'ACTIVE',
        },
        {
          email: 'any_email@mail.com',
          userName: 'any_user',
          id: 0,
          name: 'any_name',
          role: 'USER',
          status: 'ACTIVE',
        },
      ]);
    });

    it('should throw when repository throws', async () => {
      const { sut, userRepository } = makeSut();
      userRepository.findAll.mockRejectedValueOnce(
        new Error('any_find_all_error'),
      );

      const promise = sut.getAll();

      await expect(promise).rejects.toThrow(new Error('any_find_all_error'));
    });
  });

  describe(`When ${UserService.prototype.getByUserName.name} is called`, () => {
    const fakeUserName = 'any@mail.com';

    it('should call repository with right params', async () => {
      const { sut, userRepository } = makeSut();
      const findByUserNameSpy = userRepository.findByUserName;

      await sut.getByUserName(fakeUserName);

      expect(findByUserNameSpy).toBeCalledWith('any@mail.com');
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getByUserName(fakeUserName);

      expect(result).toEqual({
        email: 'any_email@mail.com',
        userName: 'any_user',
        id: 0,
        name: 'any_name',
        role: 'USER',
        status: 'ACTIVE',
      });
    });

    it('should return null when repository result is null', async () => {
      const { sut, userRepository } = makeSut();
      userRepository.findByUserName.mockResolvedValueOnce(null);

      const promise = sut.getByUserName(fakeUserName);

      await expect(promise).rejects.toThrow(
        new NotFoundError('user not found with provided userName'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, userRepository } = makeSut();
      userRepository.findByUserName.mockRejectedValueOnce(
        new Error('any_find_by_error'),
      );

      const promise = sut.getByUserName(fakeUserName);

      await expect(promise).rejects.toThrow(new Error('any_find_by_error'));
    });
  });

  describe(`When ${UserService.prototype.create.name} is called`, () => {
    const fakeUser = makeFakeCreateUserInput();

    it('should call repository with right params', async () => {
      const { sut, userRepository } = makeSut();
      const createSpy = userRepository.create;

      await sut.create(fakeUser);

      expect(createSpy).toBeCalledWith({
        ...makeFakeCreateUserInput(),
        password: 'hashed_password',
      });
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.create(fakeUser);

      expect(result).toEqual(makeFakeUser({}));
    });

    it('should return repository result when user has no commission', async () => {
      const { sut } = makeSut();
      const user: User = makeFakeUser({});

      const result = await sut.create(user);

      expect(result).toEqual(makeFakeUser({}));
    });

    it('should throw when repository throws', async () => {
      const { sut, userRepository } = makeSut();
      userRepository.create.mockRejectedValueOnce(
        new Error('any_create_error'),
      );

      const promise = sut.create(fakeUser);

      await expect(promise).rejects.toThrow(new Error('any_create_error'));
    });
  });

  describe(`When ${UserService.prototype.updateById.name} is called`, () => {
    const fakeId = 777;
    const fakeUser = makeFakeUpdateUserInput();

    it('should call repository with right params', async () => {
      const { sut, userRepository } = makeSut();
      const updateSpy = userRepository.updateById;

      await sut.updateById(fakeId, fakeUser);

      expect(updateSpy).toBeCalledWith(777, {
        ...makeFakeUpdateUserInput(),
      });
    });

    it('should throw not found error when the the resource with the provided id does not exist', async () => {
      const { sut, userRepository } = makeSut();
      userRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.updateById(fakeId, fakeUser)).rejects.toThrow(
        new NotFoundError('user not found with provided id'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, userRepository } = makeSut();
      userRepository.updateById.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.updateById(fakeId, fakeUser);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${UserService.prototype.deleteById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, userRepository } = makeSut();
      const deleteSpy = userRepository.deleteById;

      await sut.deleteById(fakeId);

      expect(deleteSpy).toBeCalledWith(777);
    });

    it('should throw when repository throws', async () => {
      const { sut, userRepository } = makeSut();
      userRepository.deleteById.mockRejectedValueOnce(
        new Error('any_delete_error'),
      );

      const promise = sut.deleteById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_delete_error'));
    });

    it('should throw not found error when the the resource with the provided id does not exist', async () => {
      const { sut, userRepository } = makeSut();
      userRepository.findById.mockResolvedValueOnce(null);

      const promise = sut.deleteById(fakeId);

      await expect(promise).rejects.toThrow(
        new NotFoundError('user not found with provided id'),
      );
    });
  });
});
