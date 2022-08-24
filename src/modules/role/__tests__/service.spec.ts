import { NotFoundError } from '../../../shared/errors';
import { RoleService } from '../service';
import {
  makeRoleRepositoryStub,
  makeFakeRole,
  makeFakeRoleList,
  makeFakeCreateRoleInput,
  makeFakeUpdateRoleInput,
} from './helpers/test-helper';

const makeSut = () => {
  const roleRepository = makeRoleRepositoryStub();
  const sut = new RoleService(roleRepository);

  return { sut, roleRepository };
};

describe(RoleService.name, () => {
  describe(`When ${RoleService.prototype.getAll.name} is called`, () => {
    it('should call repository with right params', async () => {
      const { sut, roleRepository } = makeSut();
      const findAllSpy = roleRepository.findAll;

      await sut.getAll();

      expect(findAllSpy).toBeCalledWith();
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getAll();

      expect(result).toEqual(
        makeFakeRoleList().map(role => ({
          ...role,
          commission: 10,
        })),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, roleRepository } = makeSut();
      roleRepository.findAll.mockRejectedValueOnce(
        new Error('any_find_all_error'),
      );

      const promise = sut.getAll();

      await expect(promise).rejects.toThrow(new Error('any_find_all_error'));
    });
  });

  describe(`When ${RoleService.prototype.getById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, roleRepository } = makeSut();
      const findByIdSpy = roleRepository.findById;

      await sut.getById(fakeId);

      expect(findByIdSpy).toBeCalledWith(777);
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getById(fakeId);

      expect(result).toEqual({ ...makeFakeRole({}), commission: 10 });
    });

    it('should return null when repository result is null', async () => {
      const { sut, roleRepository } = makeSut();
      roleRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.getById(fakeId)).rejects.toThrow(
        new NotFoundError('role not found with provided id'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, roleRepository } = makeSut();
      roleRepository.findById.mockRejectedValueOnce(
        new Error('any_find_by_error'),
      );

      const promise = sut.getById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_find_by_error'));
    });
  });

  describe(`When ${RoleService.prototype.create.name} is called`, () => {
    const fakeRole = makeFakeCreateRoleInput();

    it('should call repository with right params', async () => {
      const { sut, roleRepository } = makeSut();
      const createSpy = roleRepository.create;

      await sut.create(fakeRole);

      expect(createSpy).toBeCalledWith({
        ...makeFakeCreateRoleInput(),
        commission: 1000,
      });
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.create(fakeRole);

      expect(result).toEqual(makeFakeRole({}));
    });

    it('should return repository result when role has no commission', async () => {
      const { sut } = makeSut();
      const role = {
        name: 'any_name',
        taxId: '00000000000',
        city: 'any_city',
        state: 'any_state',
        createdBy: 'any_role',
      };

      const result = await sut.create(role);

      expect(result).toEqual(makeFakeRole({}));
    });

    it('should throw when repository throws', async () => {
      const { sut, roleRepository } = makeSut();
      roleRepository.create.mockRejectedValueOnce(
        new Error('any_create_error'),
      );

      const promise = sut.create(fakeRole);

      await expect(promise).rejects.toThrow(new Error('any_create_error'));
    });
  });

  describe(`When ${RoleService.prototype.updateById.name} is called`, () => {
    const fakeId = 777;
    const fakeRole = makeFakeUpdateRoleInput();

    it('should call repository with right params', async () => {
      const { sut, roleRepository } = makeSut();
      const updateSpy = roleRepository.updateById;

      await sut.updateById(fakeId, fakeRole);

      expect(updateSpy).toBeCalledWith(777, {
        ...makeFakeUpdateRoleInput(),
        commission: 1000,
      });
    });

    it('should throw not found error when the the resource with the provided id does not exist', async () => {
      const { sut, roleRepository } = makeSut();
      roleRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.updateById(fakeId, fakeRole)).rejects.toThrow(
        new NotFoundError('role not found with provided id'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, roleRepository } = makeSut();
      roleRepository.updateById.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.updateById(fakeId, fakeRole);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${RoleService.prototype.deleteById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, roleRepository } = makeSut();
      const deleteSpy = roleRepository.deleteById;

      await sut.deleteById(fakeId);

      expect(deleteSpy).toBeCalledWith(777);
    });

    it('should throw when repository throws', async () => {
      const { sut, roleRepository } = makeSut();
      roleRepository.deleteById.mockRejectedValueOnce(
        new Error('any_delete_error'),
      );

      const promise = sut.deleteById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_delete_error'));
    });

    it('should throw not found error when the the resource with the provided id does not exist', async () => {
      const { sut, roleRepository } = makeSut();
      roleRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.deleteById(fakeId)).rejects.toThrow(
        new NotFoundError('role not found with provided id'),
      );
    });
  });
});
