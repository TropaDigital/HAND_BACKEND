import { NotFoundError } from '../../../shared/errors';
import { AffiliationService } from '../service';
import {
  makeAffiliationRepositoryStub,
  makeFakeAffiliation,
  makeFakeAffiliationList,
  makeFakeCreateAffiliationInput,
  makeFakeUpdateAffiliationInput,
} from './helpers/test-helper';

const makeSut = () => {
  const affiliationRepository = makeAffiliationRepositoryStub();
  const sut = new AffiliationService(affiliationRepository);

  return { sut, affiliationRepository };
};

describe(AffiliationService.name, () => {
  describe(`When ${AffiliationService.prototype.getAll.name} is called`, () => {
    it('should call repository with right params', async () => {
      const { sut, affiliationRepository } = makeSut();
      const findAllSpy = affiliationRepository.findAll;

      await sut.getAll();

      expect(findAllSpy).toBeCalledWith();
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getAll();

      expect(result).toEqual(
        makeFakeAffiliationList().map(affiliation => ({
          ...affiliation,
        })),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, affiliationRepository } = makeSut();
      affiliationRepository.findAll.mockRejectedValueOnce(
        new Error('any_find_all_error'),
      );

      const promise = sut.getAll();

      await expect(promise).rejects.toThrow(new Error('any_find_all_error'));
    });
  });

  describe(`When ${AffiliationService.prototype.getById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, affiliationRepository } = makeSut();
      const findByIdSpy = affiliationRepository.findById;

      await sut.getById(fakeId);

      expect(findByIdSpy).toBeCalledWith(777);
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getById(fakeId);

      expect(result).toEqual({ ...makeFakeAffiliation({}) });
    });

    it('should return null when repository result is null', async () => {
      const { sut, affiliationRepository } = makeSut();
      affiliationRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.getById(fakeId)).rejects.toThrow(
        new NotFoundError('affiliation not found with provided id'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, affiliationRepository } = makeSut();
      affiliationRepository.findById.mockRejectedValueOnce(
        new Error('any_find_by_error'),
      );

      const promise = sut.getById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_find_by_error'));
    });
  });

  describe(`When ${AffiliationService.prototype.create.name} is called`, () => {
    const fakeAffiliation = makeFakeCreateAffiliationInput();

    it('should call repository with right params', async () => {
      const { sut, affiliationRepository } = makeSut();
      const createSpy = affiliationRepository.create;

      await sut.create(fakeAffiliation as any);

      expect(createSpy).toBeCalledWith({
        ...makeFakeCreateAffiliationInput(),
      });
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.create(fakeAffiliation as any);

      expect(result).toEqual(makeFakeAffiliation({}));
    });

    it('should return repository result when affiliation has no commission', async () => {
      const { sut } = makeSut();
      const affiliation = {
        name: 'any_name',
        taxId: '00000000000',
        city: 'any_city',
        state: 'any_state',
        createdBy: 'any_affiliation',
        corporateTaxId: '35.882.309/0001-37',
      };

      const result = await sut.create(affiliation as any);

      expect(result).toEqual(makeFakeAffiliation({}));
    });

    it('should throw when repository throws', async () => {
      const { sut, affiliationRepository } = makeSut();
      affiliationRepository.create.mockRejectedValueOnce(
        new Error('any_create_error'),
      );

      const promise = sut.create(fakeAffiliation as any);

      await expect(promise).rejects.toThrow(new Error('any_create_error'));
    });
  });

  describe(`When ${AffiliationService.prototype.updateById.name} is called`, () => {
    const fakeId = 777;
    const fakeAffiliation = makeFakeUpdateAffiliationInput();

    it('should call repository with right params', async () => {
      const { sut, affiliationRepository } = makeSut();
      const updateSpy = affiliationRepository.updateById;

      await sut.updateById(fakeId, fakeAffiliation);

      expect(updateSpy).toBeCalledWith(777, {
        ...makeFakeUpdateAffiliationInput(),
      });
    });

    it('should throw not found error when the the resource with the provided id does not exist', async () => {
      const { sut, affiliationRepository } = makeSut();
      affiliationRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.updateById(fakeId, fakeAffiliation)).rejects.toThrow(
        new NotFoundError('affiliation not found with provided id'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, affiliationRepository } = makeSut();
      affiliationRepository.updateById.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.updateById(fakeId, fakeAffiliation);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${AffiliationService.prototype.deleteById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, affiliationRepository } = makeSut();
      const deleteSpy = affiliationRepository.deleteById;

      await sut.deleteById(fakeId);

      expect(deleteSpy).toBeCalledWith(777);
    });

    it('should throw when repository throws', async () => {
      const { sut, affiliationRepository } = makeSut();
      affiliationRepository.deleteById.mockRejectedValueOnce(
        new Error('any_delete_error'),
      );

      const promise = sut.deleteById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_delete_error'));
    });

    it('should throw not found error when the the resource with the provided id does not exist', async () => {
      const { sut, affiliationRepository } = makeSut();
      affiliationRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.deleteById(fakeId)).rejects.toThrow(
        new NotFoundError('affiliation not found with provided id'),
      );
    });
  });
});
