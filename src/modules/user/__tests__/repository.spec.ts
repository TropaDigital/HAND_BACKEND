import { UserRepository } from '../repository';
import {
  makeFakeUser,
  makeFakeUserList,
  makePrismaUserRepositoryStub,
} from './helpers/test-helper';

const makeSut = () => {
  const prismaRepository = makePrismaUserRepositoryStub();
  const sut = new UserRepository(prismaRepository);

  return { sut, prismaRepository };
};

describe(UserRepository.name, () => {
  describe(`When ${UserRepository.prototype.findAll.name} is called`, () => {
    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const findManySpy = prismaRepository.findMany;

      await sut.findAll();

      expect(findManySpy).toBeCalledWith();
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.findAll();

      expect(result).toEqual(makeFakeUserList());
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.findMany.mockRejectedValueOnce(
        new Error('any_find_many_error'),
      );

      const promise = sut.findAll();

      await expect(promise).rejects.toThrow(new Error('any_find_many_error'));
    });
  });

  describe(`When ${UserRepository.prototype.findById.name} is called`, () => {
    const fakeId = 777;

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const findFirstSpy = prismaRepository.findFirst;

      await sut.findById(fakeId);

      expect(findFirstSpy).toBeCalledWith({ where: { id: 777 } });
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.findById(fakeId);

      expect(result).toEqual(makeFakeUser({}));
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.findFirst.mockRejectedValueOnce(
        new Error('any_find_first_error'),
      );

      const promise = sut.findById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_find_first_error'));
    });
  });

  describe(`When ${UserRepository.prototype.findByEmail.name} is called`, () => {
    const fakeEmail = 'mail@mail.com';

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const findFirstSpy = prismaRepository.findFirst;

      await sut.findByEmail(fakeEmail);

      expect(findFirstSpy).toBeCalledWith({
        where: { email: 'mail@mail.com' },
      });
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.findByEmail(fakeEmail);

      expect(result).toEqual(makeFakeUser({}));
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.findFirst.mockRejectedValueOnce(
        new Error('any_find_first_error'),
      );

      const promise = sut.findByEmail(fakeEmail);

      await expect(promise).rejects.toThrow(new Error('any_find_first_error'));
    });
  });

  describe(`When ${UserRepository.prototype.create.name} is called`, () => {
    const fakeUser = makeFakeUser({});

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const createSpy = prismaRepository.create;

      await sut.create(fakeUser);

      expect(createSpy).toBeCalledWith({ data: makeFakeUser({}) });
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.create(fakeUser);

      expect(result).toEqual({
        email: 'any_email@mail.com',
        id: 0,
        name: 'any_name',
        role: 'any_role',
        status: 'active',
      });
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.create.mockRejectedValueOnce(
        new Error('any_create_error'),
      );

      const promise = sut.create(fakeUser);

      await expect(promise).rejects.toThrow(new Error('any_create_error'));
    });
  });

  describe(`When ${UserRepository.prototype.updateById.name} is called`, () => {
    const fakeUser = makeFakeUser({});
    const fakeId = 777;

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const updateSpy = prismaRepository.update;

      await sut.updateById(fakeId, fakeUser);

      expect(updateSpy).toBeCalledWith({
        data: makeFakeUser({}),
        where: { id: 777 },
      });
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.update.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.updateById(fakeId, fakeUser);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${UserRepository.prototype.deleteById.name} is called`, () => {
    const fakeId = 777;

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const deleteSpy = prismaRepository.delete;

      await sut.deleteById(fakeId);

      expect(deleteSpy).toBeCalledWith({
        where: { id: 777 },
      });
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.delete.mockRejectedValueOnce(
        new Error('any_delete_error'),
      );

      const promise = sut.deleteById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_delete_error'));
    });
  });
});
