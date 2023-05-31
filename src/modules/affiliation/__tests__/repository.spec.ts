import { AffiliationRepository } from '../repository';
import {
  makeFakeAffiliation,
  makeFakeAffiliationList,
  makePrismaAffiliationRepositoryStub,
} from './helpers/test-helper';

const makeSut = () => {
  const prismaRepository = makePrismaAffiliationRepositoryStub();
  const sut = new AffiliationRepository(prismaRepository);

  return { sut, prismaRepository };
};

describe(AffiliationRepository.name, () => {
  describe(`When ${AffiliationRepository.prototype.findAll.name} is called`, () => {
    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const findManySpy = prismaRepository.findMany;

      await sut.findAll();

      expect(findManySpy).toBeCalledWith();
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.findAll();

      expect(result).toEqual(makeFakeAffiliationList());
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

  describe(`When ${AffiliationRepository.prototype.findById.name} is called`, () => {
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

      expect(result).toEqual(makeFakeAffiliation({}));
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

  describe(`When ${AffiliationRepository.prototype.create.name} is called`, () => {
    const fakeAffiliation = makeFakeAffiliation({});

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const createSpy = prismaRepository.create;

      await sut.create(fakeAffiliation as any);

      expect(createSpy).toBeCalledWith({ data: makeFakeAffiliation({}) });
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.create(fakeAffiliation as any);

      expect(result).toEqual(makeFakeAffiliation({}));
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.create.mockRejectedValueOnce(
        new Error('any_create_error'),
      );

      const promise = sut.create(fakeAffiliation as any);

      await expect(promise).rejects.toThrow(new Error('any_create_error'));
    });
  });

  describe(`When ${AffiliationRepository.prototype.updateById.name} is called`, () => {
    const fakeAffiliation = makeFakeAffiliation({});
    const fakeId = 777;

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const updateSpy = prismaRepository.update;

      await sut.updateById(fakeId, fakeAffiliation);

      expect(updateSpy).toBeCalledWith({
        data: makeFakeAffiliation({}),
        where: { id: 777 },
      });
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.update.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.updateById(fakeId, fakeAffiliation);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${AffiliationRepository.prototype.deleteById.name} is called`, () => {
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
