/* eslint-disable @typescript-eslint/no-explicit-any */
import { BenefitRepository } from '../repository';
import {
  makeFakeBenefit,
  makeFakeBenefitList,
  makePrismaClient,
} from './helpers/test-helper';

const makeSut = () => {
  const { prismaClient, prismaBenefitRepository } = makePrismaClient();

  const sut = new BenefitRepository(prismaClient);

  return { sut, prismaRepository: prismaBenefitRepository };
};

describe(BenefitRepository.name, () => {
  describe(`When ${BenefitRepository.prototype.findAll.name} is called`, () => {
    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const findManySpy = prismaRepository.findMany;

      await sut.findAll();

      expect(findManySpy).toBeCalledWith({
        where: {},
        include: {
          affiliation: true,
          associated: true,
          consultant: true,
          installments: {
            where: {
              status: {
                notIn: ['CANCELED'],
              },
            },
          },
        },
      });
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.findAll();

      expect(result).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalResults: 11,
        data: makeFakeBenefitList(),
      });
    });

    it('should return prisma result when pass params', async () => {
      const { sut } = makeSut();

      const result = await sut.findAll({ associatedId: 1 });

      expect(result).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalResults: 11,
        data: makeFakeBenefitList(),
      });
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

  describe(`When ${BenefitRepository.prototype.findById.name} is called`, () => {
    const fakeId = 777;

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const findFirstSpy = prismaRepository.findFirst;

      await sut.findById(fakeId);

      expect(findFirstSpy).toBeCalledWith({
        where: { id: 777 },
        include: {
          affiliation: true,
          associated: true,
          consultant: true,
          installments: {
            orderBy: {
              referenceDate: 'asc',
            },
            where: {
              status: {
                not: 'CANCELED',
              },
            },
          },
        },
      });
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.findById(fakeId);

      expect(result).toEqual({
        ...makeFakeBenefit({}),
      });
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

  describe(`When ${BenefitRepository.prototype.create.name} is called`, () => {
    const fakeBenefit = makeFakeBenefit({});

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const createSpy = prismaRepository.create;

      await sut.create(fakeBenefit as any);

      expect(createSpy).toBeCalledWith({
        data: {
          ...makeFakeBenefit({}),
          benefitHistory: { create: expect.anything() },
        },
        include: { benefitHistory: true },
      });
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.create(fakeBenefit as any);

      expect(result).toEqual(makeFakeBenefit({}));
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.create.mockRejectedValueOnce(
        new Error('any_create_error'),
      );

      const promise = sut.create(fakeBenefit as any);

      await expect(promise).rejects.toThrow(new Error('any_create_error'));
    });
  });

  describe(`When ${BenefitRepository.prototype.updateById.name} is called`, () => {
    const fakeBenefit = makeFakeBenefit({});
    const fakeId = 777;

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const updateSpy = prismaRepository.update;

      await sut.updateById(fakeId, fakeBenefit as any);

      expect(updateSpy).toBeCalledWith({
        data: makeFakeBenefit({}),
        where: { id: 777 },
      });
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.update.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.updateById(fakeId, fakeBenefit as any);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${BenefitRepository.prototype.deleteById.name} is called`, () => {
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
