/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeFakeAddressesParams } from '../../../../__tests__/functionals/associations/helpers';
import { NotFoundError } from '../../../shared/errors';
import { makeBenefitServiceStub } from '../../benefit/__tests__/helpers/test-helper';
import { AssociatedService } from '../service';
import {
  makeAssociatedRepositoryStub,
  makeFakeAssociated,
  makeFakeAssociatedList,
  makeFakeCreateAssociatedInput,
  makeFakeUpdateAssociatedInput,
} from './helpers/test-helper';

jest.mock('../../../shared/code', () => ({
  generateInsertCode: jest.fn().mockReturnValue('2022217148'),
}));

const makeSut = () => {
  const associatedRepository = makeAssociatedRepositoryStub();
  const benefitService = makeBenefitServiceStub();
  const sut = new AssociatedService(associatedRepository, benefitService);

  return { sut, associatedRepository };
};

describe(AssociatedService.name, () => {
  describe(`When ${AssociatedService.prototype.getAll.name} is called`, () => {
    it('should call repository with right params', async () => {
      const { sut, associatedRepository } = makeSut();
      const findAllSpy = associatedRepository.findAll;

      await sut.getAll();

      expect(findAllSpy).toBeCalledWith(undefined);
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getAll();

      expect(result).toEqual({
        data: makeFakeAssociatedList().map(associated => ({
          ...associated,
        })),
      });
    });

    it('should throw when repository throws', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.findAll.mockRejectedValueOnce(
        new Error('any_find_all_error'),
      );

      const promise = sut.getAll();

      await expect(promise).rejects.toThrow(new Error('any_find_all_error'));
    });
  });

  describe(`When ${AssociatedService.prototype.getById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, associatedRepository } = makeSut();
      const findByIdSpy = associatedRepository.findById;

      await sut.getById(fakeId);

      expect(findByIdSpy).toBeCalledWith(777);
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getById(fakeId);

      expect(result).toEqual({ ...makeFakeAssociated({}) });
    });

    it('should return null when repository result is null', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.getById(fakeId)).rejects.toThrow(
        new NotFoundError('associated not found with provided id'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.findById.mockRejectedValueOnce(
        new Error('any_find_by_error'),
      );

      const promise = sut.getById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_find_by_error'));
    });
  });

  describe(`When ${AssociatedService.prototype.create.name} is called`, () => {
    const fakeAssociated = makeFakeCreateAssociatedInput();

    it('should call repository with right params', async () => {
      const { sut, associatedRepository } = makeSut();
      const createSpy = associatedRepository.create;

      await sut.create(fakeAssociated);

      expect(createSpy).toBeCalledWith({
        ...makeFakeCreateAssociatedInput({ code: '2022217148' }),
      });
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.create(fakeAssociated);

      expect(result).toEqual(makeFakeAssociated({}));
    });

    it('should return repository result when associated has no commission', async () => {
      const { sut } = makeSut();
      const { benefits, ...associated } = makeFakeAssociated({});

      const result = await sut.create(associated as any);

      expect(result).toEqual(makeFakeAssociated({}));
    });

    it('should throw when repository throws', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.create.mockRejectedValueOnce(
        new Error('any_create_error'),
      );

      const promise = sut.create(fakeAssociated);

      await expect(promise).rejects.toThrow(new Error('any_create_error'));
    });
  });

  describe(`When ${AssociatedService.prototype.updateById.name} is called`, () => {
    const fakeId = 777;
    const fakeAssociated = makeFakeUpdateAssociatedInput();

    it('should call repository with right params', async () => {
      const { sut, associatedRepository } = makeSut();
      const updateSpy = associatedRepository.updateById;

      await sut.updateById(fakeId, fakeAssociated);

      expect(updateSpy).toBeCalledWith(777, {
        ...makeFakeUpdateAssociatedInput(),
        id: 0,
        updatedAt: new Date('2022-04-15'),
        createdAt: new Date('2022-04-15'),
        code: '2022217148',
        deletedAt: null,
        updatedBy: 'any',
      });
    });

    it('should throw not found error when the the resource with the provided id does not exist', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.updateById(fakeId, fakeAssociated)).rejects.toThrow(
        new NotFoundError('associated not found with provided id'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.updateById.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.updateById(fakeId, fakeAssociated);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${AssociatedService.prototype.upsertEmploymentRelationshipById.name} is called`, () => {
    const fakeId = 777;
    const fakeAddressId = 888;
    const fakeAddress = makeFakeAddressesParams();

    it('should call repository with right params', async () => {
      const { sut, associatedRepository } = makeSut();
      const updateSpy = associatedRepository.upsertEmploymentRelationshipById;

      await sut.upsertEmploymentRelationshipById(
        fakeId,
        fakeAddressId,
        fakeAddress,
      );

      expect(updateSpy).toBeCalledWith(777, 888, {
        ...makeFakeAddressesParams(),
      });
    });

    it('should throw when repository throws', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.upsertEmploymentRelationshipById.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.upsertEmploymentRelationshipById(
        fakeId,
        fakeAddressId,
        fakeAddress,
      );

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${AssociatedService.prototype.upsertAddressById.name} is called`, () => {
    const fakeId = 777;
    const fakeAddressId = 888;
    const fakeAddress = makeFakeAddressesParams();

    it('should call repository with right params', async () => {
      const { sut, associatedRepository } = makeSut();
      const updateSpy = associatedRepository.upsertAddressById;

      await sut.upsertAddressById(fakeId, fakeAddressId, fakeAddress);

      expect(updateSpy).toBeCalledWith(777, 888, {
        ...makeFakeAddressesParams(),
      });
    });

    it('should throw when repository throws', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.upsertAddressById.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.upsertAddressById(fakeId, fakeAddressId, fakeAddress);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${AssociatedService.prototype.getEmploymentRelationshipsByAssociatedId.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, associatedRepository } = makeSut();
      const updateSpy =
        associatedRepository.getEmploymentRelationshipsByAssociatedId;

      await sut.getEmploymentRelationshipsByAssociatedId(fakeId);

      expect(updateSpy).toBeCalledWith(777);
    });

    it('should throw not found error when returns empty array', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.getEmploymentRelationshipsByAssociatedId.mockResolvedValueOnce(
        [],
      );

      const result = await sut.getEmploymentRelationshipsByAssociatedId(fakeId);

      expect(result).toEqual([]);
    });

    it('should throw when repository throws', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.getEmploymentRelationshipsByAssociatedId.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.getEmploymentRelationshipsByAssociatedId(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${AssociatedService.prototype.getAddressesByAssociatedId.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, associatedRepository } = makeSut();
      const updateSpy = associatedRepository.getAddressesByAssociatedId;

      await sut.getAddressesByAssociatedId(fakeId);

      expect(updateSpy).toBeCalledWith(777);
    });

    it('should throw not found error when returns empty array', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.getAddressesByAssociatedId.mockResolvedValueOnce([]);

      const result = await sut.getAddressesByAssociatedId(fakeId);

      expect(result).toEqual([]);
    });

    it('should throw when repository throws', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.getAddressesByAssociatedId.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.getAddressesByAssociatedId(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${AssociatedService.prototype.deleteById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, associatedRepository } = makeSut();
      const deleteSpy = associatedRepository.deleteById;

      await sut.deleteById(fakeId);

      expect(deleteSpy).toBeCalledWith(777);
    });

    it('should throw when repository throws', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.deleteById.mockRejectedValueOnce(
        new Error('any_delete_error'),
      );

      const promise = sut.deleteById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_delete_error'));
    });

    it('should throw not found error when the the resource with the provided id does not exist', async () => {
      const { sut, associatedRepository } = makeSut();
      associatedRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.deleteById(fakeId)).rejects.toThrow(
        new NotFoundError('associated not found with provided id'),
      );
    });
  });
});
