import { NotFoundError } from '../../../shared/errors';
import { ConsultantService } from '../service';
import {
  makeConsultantRepositoryStub,
  makeFakeConsultant,
  makeFakeConsultantList,
  makeFakeCreateConsultantInput,
  makeFakeUpdateConsultantInput,
} from './helpers/test-helper';

const makeSut = () => {
  const consultantRepository = makeConsultantRepositoryStub();
  const sut = new ConsultantService(consultantRepository);

  return { sut, consultantRepository };
};

describe(ConsultantService.name, () => {
  describe(`When ${ConsultantService.prototype.getAll.name} is called`, () => {
    it('should call repository with right params', async () => {
      const { sut, consultantRepository } = makeSut();
      const findAllSpy = consultantRepository.findAll;

      await sut.getAll();

      expect(findAllSpy).toBeCalledWith();
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getAll();

      expect(result).toEqual(
        makeFakeConsultantList().map(consultant => ({
          ...consultant,
          commission: 10,
        })),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.findAll.mockRejectedValueOnce(
        new Error('any_find_all_error'),
      );

      const promise = sut.getAll();

      await expect(promise).rejects.toThrow(new Error('any_find_all_error'));
    });
  });

  describe(`When ${ConsultantService.prototype.getById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, consultantRepository } = makeSut();
      const findByIdSpy = consultantRepository.findById;

      await sut.getById(fakeId);

      expect(findByIdSpy).toBeCalledWith(777);
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getById(fakeId);

      expect(result).toEqual({ ...makeFakeConsultant(), commission: 10 });
    });

    it('should return null when repository result is null', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.getById(fakeId)).rejects.toThrow(
        new NotFoundError('consultant not found with provided id'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.findById.mockRejectedValueOnce(
        new Error('any_find_by_error'),
      );

      const promise = sut.getById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_find_by_error'));
    });
  });

  describe(`When ${ConsultantService.prototype.create.name} is called`, () => {
    const fakeConsultant = makeFakeCreateConsultantInput();

    it('should call repository with right params', async () => {
      const { sut, consultantRepository } = makeSut();
      const createSpy = consultantRepository.create;

      await sut.create(fakeConsultant);

      expect(createSpy).toBeCalledWith({
        ...makeFakeCreateConsultantInput(),
        commission: 1000,
      });
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.create(fakeConsultant);

      expect(result).toEqual(makeFakeConsultant());
    });

    it('should return repository result when consultant has no commission', async () => {
      const { sut } = makeSut();
      const consultant = {
        name: 'any_name',
        taxId: '00000000000',
        city: 'any_city',
        state: 'any_state',
        createdBy: 'any_user',
      };

      const result = await sut.create(consultant);

      expect(result).toEqual(makeFakeConsultant());
    });

    it('should throw when repository throws', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.create.mockRejectedValueOnce(
        new Error('any_create_error'),
      );

      const promise = sut.create(fakeConsultant);

      await expect(promise).rejects.toThrow(new Error('any_create_error'));
    });
  });

  describe(`When ${ConsultantService.prototype.updateById.name} is called`, () => {
    const fakeId = 777;
    const fakeConsultant = makeFakeUpdateConsultantInput();

    it('should call repository with right params', async () => {
      const { sut, consultantRepository } = makeSut();
      const updateSpy = consultantRepository.updateById;

      await sut.updateById(fakeId, fakeConsultant);

      expect(updateSpy).toBeCalledWith(777, {
        ...makeFakeUpdateConsultantInput(),
        commission: 1000,
      });
    });

    it('should throw not found error when the the resource with the provided id does not exist', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.updateById(fakeId, fakeConsultant)).rejects.toThrow(
        new NotFoundError('consultant not found with provided id'),
      );
    });

    it('should throw when repository throws', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.updateById.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.updateById(fakeId, fakeConsultant);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${ConsultantService.prototype.deleteById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, consultantRepository } = makeSut();
      const deleteSpy = consultantRepository.deleteById;

      await sut.deleteById(fakeId);

      expect(deleteSpy).toBeCalledWith(777);
    });

    it('should throw when repository throws', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.deleteById.mockRejectedValueOnce(
        new Error('any_delete_error'),
      );

      const promise = sut.deleteById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_delete_error'));
    });

    it('should throw not found error when the the resource with the provided id does not exist', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.deleteById(fakeId)).rejects.toThrow(
        new NotFoundError('consultant not found with provided id'),
      );
    });
  });
});
