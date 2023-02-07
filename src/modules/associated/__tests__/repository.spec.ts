/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssociatedRepository } from '../repository';
import {
  makeFakeAssociated,
  makeFakeAssociatedList,
  makePrismaAssociatedRepositoryStub,
} from './helpers/test-helper';

jest.mock('../../../shared/code', () => ({
  generateInsertCode: jest.fn().mockReturnValue('2022217148'),
}));

const makeSut = () => {
  const prismaRepository = makePrismaAssociatedRepositoryStub();
  const sut = new AssociatedRepository(prismaRepository);

  return { sut, prismaRepository };
};

describe(AssociatedRepository.name, () => {
  describe(`When ${AssociatedRepository.prototype.findAll.name} is called`, () => {
    it('should call prisma with right params when no params is provided', async () => {
      const { sut, prismaRepository } = makeSut();
      const findManySpy = prismaRepository.findMany;

      await sut.findAll({});

      expect(findManySpy).toBeCalledWith({
        include: {
          addresses: {
            orderBy: {
              isDefault: 'desc',
            },
          },
          employmentRelationships: {
            orderBy: {
              isDefault: 'desc',
            },
          },
          bankAccounts: {
            orderBy: {
              isDefault: 'desc',
            },
          },
          benefits: {
            include: {
              affiliation: true,
              consultant: true,
            },
          },
          affiliations: true,
          phoneNumbers: true,
          references: true,
        },
        where: {},
      });
    });

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const findManySpy = prismaRepository.findMany;

      await sut.findAll({ id: 1 });

      expect(findManySpy).toBeCalledWith({
        include: {
          addresses: {
            orderBy: {
              isDefault: 'desc',
            },
          },
          employmentRelationships: {
            orderBy: {
              isDefault: 'desc',
            },
          },
          bankAccounts: {
            orderBy: {
              isDefault: 'desc',
            },
          },
          benefits: {
            include: {
              affiliation: true,
              consultant: true,
            },
          },
          affiliations: true,
          phoneNumbers: true,
          references: true,
        },
        where: { id: { contains: 1 } },
      });
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.findAll();

      expect(result).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalResults: 10,
        data: makeFakeAssociatedList(),
      });
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.findAll({ name: 'any_name' });

      expect(result).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalResults: 2,
        data: makeFakeAssociatedList(),
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

  describe(`When ${AssociatedRepository.prototype.findById.name} is called`, () => {
    const fakeId = 777;

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const findFirstSpy = prismaRepository.findFirst;

      await sut.findById(fakeId);

      expect(findFirstSpy).toBeCalledWith({
        include: {
          addresses: {
            orderBy: {
              isDefault: 'desc',
            },
          },
          employmentRelationships: {
            orderBy: {
              isDefault: 'desc',
            },
          },
          bankAccounts: {
            orderBy: {
              isDefault: 'desc',
            },
          },
          benefits: {
            include: {
              affiliation: true,
              consultant: true,
            },
          },
          affiliations: true,
          phoneNumbers: true,
          references: true,
        },
        where: { id: 777 },
      });
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.findById(fakeId);

      expect(result).toEqual(makeFakeAssociated({}));
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

  describe(`When ${AssociatedRepository.prototype.create.name} is called`, () => {
    const fakeAssociated = makeFakeAssociated({});

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const createSpy = prismaRepository.create;

      await sut.create(fakeAssociated as any);

      const {
        addresses,
        employmentRelationships,
        bankAccounts,
        affiliations,
        ...associated
      } = makeFakeAssociated({});

      expect(createSpy).toBeCalledWith({
        data: {
          ...associated,
          affiliations: { connect: [{ id: affiliations[0].id }] },
          bankAccounts: { createMany: { data: bankAccounts } },
          addresses: { createMany: { data: addresses } },
          employmentRelationships: {
            createMany: { data: employmentRelationships },
          },
        },
        include: {
          addresses: true,
          employmentRelationships: true,
          bankAccounts: true,
          affiliations: true,
          phoneNumbers: true,
          references: true,
        },
      });
    });

    it('should return prisma result', async () => {
      const { sut } = makeSut();

      const result = await sut.create(fakeAssociated as any);

      expect(result).toEqual(makeFakeAssociated({}));
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.create.mockRejectedValueOnce(
        new Error('any_create_error'),
      );

      const promise = sut.create(fakeAssociated as any);

      await expect(promise).rejects.toThrow(new Error('any_create_error'));
    });
  });

  describe(`When ${AssociatedRepository.prototype.updateById.name} is called`, () => {
    const fakeAssociated = makeFakeAssociated({});
    const fakeId = 777;

    it('should call prisma with right params', async () => {
      const { sut, prismaRepository } = makeSut();
      const updateSpy = prismaRepository.update;

      await sut.updateById(fakeId, fakeAssociated);

      const {
        addresses: _addresses,
        bankAccounts: _bankAccounts,
        employmentRelationships: _employmentRelationships,
        ...expectedAssociated
      } = {
        ...makeFakeAssociated({}),
        affiliations: { connect: [{ id: 1 }] },
      };
      expect(updateSpy).toBeCalledWith({
        data: expectedAssociated,
        where: { id: 777 },
      });
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.update.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.updateById(fakeId, fakeAssociated);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${AssociatedRepository.prototype.deleteById.name} is called`, () => {
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
