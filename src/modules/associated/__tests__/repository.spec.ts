/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { NotFoundError } from '../../../shared/errors';
import { AssociatedRepository } from '../repository';
import {
  makeFakeAddress,
  makeFakeAddressRepository,
  makeFakeAssociated,
  makeFakeAssociatedList,
  makeFakeBankAccount,
  makeFakeBankAccountRepository,
  makeFakeEmploymentRelationship,
  makeFakeEmploymentRelationshipRepository,
  makePrismaAssociatedRepositoryStub,
} from './helpers/test-helper';

jest.mock('../../../shared/code', () => ({
  generateInsertCode: jest.fn().mockReturnValue('2022217148'),
}));

const makeSut = () => {
  const prismaRepository = makePrismaAssociatedRepositoryStub();
  const bankRepository = makeFakeBankAccountRepository();
  const employmentRelationshipRepository =
    makeFakeEmploymentRelationshipRepository();
  const addressRepository = makeFakeAddressRepository();
  const prismaClient = {
    associated: prismaRepository,
    bankAccount: bankRepository,
    employmentRelationship: employmentRelationshipRepository,
    address: addressRepository,
  } as unknown as PrismaClient;
  const sut = new AssociatedRepository(prismaClient);

  return {
    sut,
    prismaRepository,
    bankRepository,
    employmentRelationshipRepository,
    addressRepository,
  };
};

describe(AssociatedRepository.name, () => {
  describe(`When ${AssociatedRepository.prototype.getBankAccountsByAssociatedId.name}`, () => {
    const fakeId = 777;

    it('should call prisma with right params', async () => {
      const { sut, bankRepository } = makeSut();
      const findManySpy = bankRepository.findMany;

      await sut.getBankAccountsByAssociatedId(fakeId);

      expect(findManySpy).toBeCalledWith({
        where: {
          associatedId: 777,
        },
      });
    });

    it('should return bank account', async () => {
      const { sut } = makeSut();

      const result = await sut.getBankAccountsByAssociatedId(fakeId);

      expect(result).toEqual(makeFakeBankAccount());
    });
  });

  describe(`When ${AssociatedRepository.prototype.getEmploymentRelationshipsByAssociatedId.name}`, () => {
    const fakeId = 777;

    it('should call prisma with right params', async () => {
      const { sut, employmentRelationshipRepository } = makeSut();
      const findManySpy = employmentRelationshipRepository.findMany;

      await sut.getEmploymentRelationshipsByAssociatedId(fakeId);

      expect(findManySpy).toBeCalledWith({
        where: {
          associatedId: 777,
        },
      });
    });

    it('should return employment relationship', async () => {
      const { sut } = makeSut();

      const result = await sut.getEmploymentRelationshipsByAssociatedId(fakeId);

      expect(result).toEqual(makeFakeEmploymentRelationship());
    });
  });

  describe(`When ${AssociatedRepository.prototype.getAddressesByAssociatedId.name}`, () => {
    const fakeId = 777;

    it('should call prisma with right params', async () => {
      const { sut, addressRepository } = makeSut();
      const findManySpy = addressRepository.findMany;

      await sut.getAddressesByAssociatedId(fakeId);

      expect(findManySpy).toBeCalledWith({
        where: {
          associatedId: 777,
        },
      });
    });

    it('should return address', async () => {
      const { sut } = makeSut();

      const result = await sut.getAddressesByAssociatedId(fakeId);

      expect(result).toEqual(makeFakeAddress());
    });
  });

  describe(`When ${AssociatedRepository.prototype.upsertEmploymentRelationshipById.name}`, () => {
    const fakeId = 777;

    it('should call prisma with right params when find first does not return', async () => {
      const { sut, employmentRelationshipRepository } = makeSut();
      const findFirstSpy = employmentRelationshipRepository.findFirst;
      const createSpy = employmentRelationshipRepository.create;

      await sut.upsertEmploymentRelationshipById(fakeId, fakeId, {});

      expect(findFirstSpy).toBeCalledWith({
        where: {
          id: 777,
        },
      });
      expect(createSpy).toBeCalledWith({
        data: {
          Associated: {
            connect: {
              id: 777,
            },
          },
        },
      });
    });

    it('should call prisma create with right params when find first returns', async () => {
      const { sut, employmentRelationshipRepository } = makeSut();
      const findFirstSpy =
        employmentRelationshipRepository.findFirst.mockResolvedValueOnce(
          makeFakeEmploymentRelationship(),
        );

      await sut.upsertEmploymentRelationshipById(fakeId, fakeId, {});

      expect(findFirstSpy).toBeCalledWith({
        where: {
          id: 777,
        },
      });
    });

    it('should upsert employment relationship', async () => {
      const { sut } = makeSut();

      const result = await sut.upsertEmploymentRelationshipById(
        fakeId,
        fakeId,
        {},
      );

      expect(result).toEqual(makeFakeEmploymentRelationship());
    });
  });

  describe(`When ${AssociatedRepository.prototype.upsertBankAccountById.name}`, () => {
    const fakeId = 777;

    it('should upsert bank account', async () => {
      const { sut } = makeSut();

      const result = await sut.upsertBankAccountById(fakeId, fakeId, {});

      expect(result).toEqual(makeFakeBankAccount());
    });

    it('should throw when prisma throws', async () => {
      const { sut, bankRepository } = makeSut();
      bankRepository.findFirst.mockRejectedValueOnce(new Error('Prisma Error'));

      const promise = sut.upsertBankAccountById(fakeId, fakeId, {});

      await expect(promise).rejects.toThrow(new Error('Prisma Error'));
    });

    it('should throw when prisma throws specific error', async () => {
      const { sut, bankRepository } = makeSut();
      bankRepository.findFirst.mockRejectedValueOnce(
        new PrismaClientKnownRequestError('Prisma Error', '10', '2'),
      );

      const promise = sut.upsertBankAccountById(fakeId, fakeId, {});

      await expect(promise).rejects.toThrow(
        new NotFoundError('associated not found with provided id'),
      );
    });
  });

  describe(`When ${AssociatedRepository.prototype.upsertAddressById.name}`, () => {
    const fakeId = 777;

    it('should upsert address', async () => {
      const { sut } = makeSut();

      const result = await sut.upsertAddressById(fakeId, fakeId, {});

      expect(result).toEqual(makeFakeAddress());
    });

    it('should throw when prisma throws', async () => {
      const { sut, addressRepository } = makeSut();
      addressRepository.findFirst.mockRejectedValueOnce(
        new Error('Prisma Error'),
      );

      const promise = sut.upsertAddressById(fakeId, fakeId, {});

      await expect(promise).rejects.toThrow(new Error('Prisma Error'));
    });

    it('should throw when prisma throws specific error', async () => {
      const { sut, addressRepository } = makeSut();
      addressRepository.findFirst.mockRejectedValueOnce(
        new PrismaClientKnownRequestError('Prisma Error', '10', '2'),
      );

      const promise = sut.upsertAddressById(fakeId, fakeId, {});

      await expect(promise).rejects.toThrow(
        new NotFoundError('associated not found with provided id'),
      );
    });
  });

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
              installments: true,
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
              installments: true,
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
      const { benefits, ...fakeUpdateAssociated } = fakeAssociated;

      await sut.create(fakeAssociated as any);

      const {
        addresses,
        employmentRelationships,
        bankAccounts,
        affiliations,
        benefits: _benefits,
        ...associated
      } = makeFakeAssociated({});

      expect(createSpy).toBeCalledWith({
        data: {
          ...associated,
          fullName: 'any_name any_last_name',
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
      const { benefits: _benefits, ...fakeUpdateAssociated } = fakeAssociated;

      const result = await sut.create(fakeAssociated as any);

      expect(result).toEqual(makeFakeAssociated({}));
    });

    it('should throw when prisma throws', async () => {
      const { sut, prismaRepository } = makeSut();
      prismaRepository.create.mockRejectedValueOnce(
        new Error('any_create_error'),
      );
      const { benefits: _benefits, ...fakeUpdateAssociated } = fakeAssociated;

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

      const { benefits, ...fakeUpdateAssociated } = fakeAssociated;

      await sut.updateById(fakeId, fakeUpdateAssociated);

      const {
        addresses: _addresses,
        bankAccounts: _bankAccounts,
        employmentRelationships: _employmentRelationships,
        benefits: _benefits,
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

      const { benefits: _benefits, ...fakeUpdateAssociated } = fakeAssociated;

      const promise = sut.updateById(fakeId, fakeUpdateAssociated);

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
