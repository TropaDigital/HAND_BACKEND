import { NotFoundError } from '../../../shared/errors';
import { BenefitService } from '../service';
import {
  makeBenefitRepositoryStub,
  makeFakeBenefit,
  makeFakeBenefitList,
  makeFakeCreateBenefitInput,
  makeFakeUpdateBenefitInput,
} from './helpers/test-helper';

const makeSut = () => {
  const benefitRepository = makeBenefitRepositoryStub();
  const sut = new BenefitService(benefitRepository);

  return { sut, benefitRepository };
};

describe(BenefitService.name, () => {
  describe(`When ${BenefitService.prototype.getAll.name} is called`, () => {
    it('should call repository with right params', async () => {
      const { sut, benefitRepository } = makeSut();
      const findAllSpy = benefitRepository.findAll;

      await sut.getAll();

      expect(findAllSpy).toBeCalledWith();
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getAll();

      expect(result).toEqual(
        makeFakeBenefitList().map(benefit => ({
          ...benefit,
        })),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, benefitRepository } = makeSut();
      benefitRepository.findAll.mockRejectedValueOnce(
        new Error('any_find_all_error'),
      );

      const promise = sut.getAll();

      await expect(promise).rejects.toThrow(new Error('any_find_all_error'));
    });
  });

  describe(`When ${BenefitService.prototype.getById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, benefitRepository } = makeSut();
      const findByIdSpy = benefitRepository.findById;

      await sut.getById(fakeId);

      expect(findByIdSpy).toBeCalledWith(777);
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getById(fakeId);

      expect(result).toEqual({ ...makeFakeBenefit({}) });
    });

    it('should return null when repository result is null', async () => {
      const { sut, benefitRepository } = makeSut();
      benefitRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.getById(fakeId)).rejects.toThrow(
        new NotFoundError('benefit not found with provided id'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, benefitRepository } = makeSut();
      benefitRepository.findById.mockRejectedValueOnce(
        new Error('any_find_by_error'),
      );

      const promise = sut.getById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_find_by_error'));
    });
  });

  describe(`When ${BenefitService.prototype.create.name} is called`, () => {
    const fakeBenefit = makeFakeCreateBenefitInput();

    it('should call repository with right params', async () => {
      const { sut, benefitRepository } = makeSut();
      const createSpy = benefitRepository.create;

      await sut.create(fakeBenefit);

      expect(createSpy).toBeCalledWith({
        ...makeFakeCreateBenefitInput(),
      });
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.create(fakeBenefit);

      expect(result).toEqual(makeFakeBenefit({}));
    });

    it('should return repository result when benefit has no commission', async () => {
      const { sut } = makeSut();
      const benefit = makeFakeBenefit({});

      const result = await sut.create(benefit);

      expect(result).toEqual(makeFakeBenefit({}));
    });

    it('should throw when repository throws', async () => {
      const { sut, benefitRepository } = makeSut();
      benefitRepository.create.mockRejectedValueOnce(
        new Error('any_create_error'),
      );

      const promise = sut.create(fakeBenefit);

      await expect(promise).rejects.toThrow(new Error('any_create_error'));
    });
  });

  describe(`When ${BenefitService.prototype.updateById.name} is called`, () => {
    const fakeId = 777;
    const fakeBenefit = makeFakeUpdateBenefitInput();

    it('should call repository with right params', async () => {
      const { sut, benefitRepository } = makeSut();
      const updateSpy = benefitRepository.updateById;

      await sut.updateById(fakeId, fakeBenefit);

      expect(updateSpy).toBeCalledWith(777, {
        ...makeFakeUpdateBenefitInput(),
      });
    });

    it('should throw not found error when the the resource with the provided id does not exist', async () => {
      const { sut, benefitRepository } = makeSut();
      benefitRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.updateById(fakeId, fakeBenefit)).rejects.toThrow(
        new NotFoundError('benefit not found with provided id'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, benefitRepository } = makeSut();
      benefitRepository.updateById.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.updateById(fakeId, fakeBenefit);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${BenefitService.prototype.deleteById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, benefitRepository } = makeSut();
      const deleteSpy = benefitRepository.deleteById;

      await sut.deleteById(fakeId);

      expect(deleteSpy).toBeCalledWith(777);
    });

    it('should throw when repository throws', async () => {
      const { sut, benefitRepository } = makeSut();
      benefitRepository.deleteById.mockRejectedValueOnce(
        new Error('any_delete_error'),
      );

      const promise = sut.deleteById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_delete_error'));
    });

    it('should throw not found error when the the resource with the provided id does not exist', async () => {
      const { sut, benefitRepository } = makeSut();
      benefitRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.deleteById(fakeId)).rejects.toThrow(
        new NotFoundError('benefit not found with provided id'),
      );
    });
  });
});
