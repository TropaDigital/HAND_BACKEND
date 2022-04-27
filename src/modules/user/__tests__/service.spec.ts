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
          id: 0,
          name: 'any_name',
          role: 'any_role',
          status: 'active',
        },
        {
          email: 'any_email@mail.com',
          id: 0,
          name: 'any_name',
          role: 'any_role',
          status: 'active',
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

  describe(`When ${UserService.prototype.getById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, userRepository } = makeSut();
      const findByIdSpy = userRepository.findById;

      await sut.getById(fakeId);

      expect(findByIdSpy).toBeCalledWith(777);
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getById(fakeId);

      expect(result).toEqual({
        email: 'any_email@mail.com',
        id: 0,
        name: 'any_name',
        role: 'any_role',
        status: 'active',
      });
    });

    it('should return null when repository result is null', async () => {
      const { sut, userRepository } = makeSut();
      userRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.getById(fakeId)).rejects.toThrow(
        new NotFoundError('user not found with provided id'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, userRepository } = makeSut();
      userRepository.findById.mockRejectedValueOnce(
        new Error('any_find_by_error'),
      );

      const promise = sut.getById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_find_by_error'));
    });
  });

  describe(`When ${UserService.prototype.getByEmail.name} is called`, () => {
    const fakeEmail = 'any@mail.com';

    it('should call repository with right params', async () => {
      const { sut, userRepository } = makeSut();
      const findByEmailSpy = userRepository.findByEmail;

      await sut.getByEmail(fakeEmail);

      expect(findByEmailSpy).toBeCalledWith('any@mail.com');
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getByEmail(fakeEmail);

      expect(result).toEqual({
        email: 'any_email@mail.com',
        id: 0,
        name: 'any_name',
        role: 'any_role',
        status: 'active',
      });
    });

    it('should return null when repository result is null', async () => {
      const { sut, userRepository } = makeSut();
      userRepository.findByEmail.mockResolvedValueOnce(null);

      const promise = sut.getByEmail(fakeEmail);

      await expect(promise).rejects.toThrow(
        new NotFoundError('user not found with provided email'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, userRepository } = makeSut();
      userRepository.findByEmail.mockRejectedValueOnce(
        new Error('any_find_by_error'),
      );

      const promise = sut.getByEmail(fakeEmail);

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
      const user: User = {
        id: 0,
        name: 'any_name',
        email: 'any_email@mail.com',
        role: 'any_role',
        status: 'active',
        password: 'any_password',
      };

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
