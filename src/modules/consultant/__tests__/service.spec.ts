import { IConsultantRepository } from '../interfaces';
import { ConsultantService } from '../service';
import {
  makeFakeConsultant,
  makeFakeConsultantList,
  makeFakeCreateConsultantInput,
  makeFakeUpdateConsultantInput,
} from './helpers/test-helper';

const makeConsultantRepositoryStub =
  (): jest.Mocked<IConsultantRepository> => ({
    findAll: jest.fn().mockResolvedValue(makeFakeConsultantList()),
    findById: jest.fn().mockResolvedValue(makeFakeConsultant()),
    create: jest.fn().mockResolvedValue(makeFakeConsultant()),
    update: jest.fn(),
    delete: jest.fn(),
  });

const makeSut = () => {
  const consultantRepository = makeConsultantRepositoryStub();
  const sut = new ConsultantService(consultantRepository);

  return { sut, consultantRepository };
};

describe(ConsultantService.name, () => {
  describe(`When ${ConsultantService.prototype.getAllConsultants.name} is called`, () => {
    it('should call repository with right params', async () => {
      const { sut, consultantRepository } = makeSut();
      const findAllSpy = consultantRepository.findAll;

      await sut.getAllConsultants();

      expect(findAllSpy).toBeCalledWith();
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getAllConsultants();

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

      const promise = sut.getAllConsultants();

      await expect(promise).rejects.toThrow(new Error('any_find_all_error'));
    });
  });

  describe(`When ${ConsultantService.prototype.getConsultantById.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, consultantRepository } = makeSut();
      const findByIdSpy = consultantRepository.findById;

      await sut.getConsultantById(fakeId);

      expect(findByIdSpy).toBeCalledWith(777);
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.getConsultantById(fakeId);

      expect(result).toEqual({ ...makeFakeConsultant(), commission: 10 });
    });

    it('should return null when repository result is null', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.findById.mockResolvedValueOnce(null);

      const result = await sut.getConsultantById(fakeId);

      expect(result).toEqual(null);
    });

    it('should throw when repository throws', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.findById.mockRejectedValueOnce(
        new Error('any_find_by_error'),
      );

      const promise = sut.getConsultantById(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_find_by_error'));
    });
  });

  describe(`When ${ConsultantService.prototype.createConsultant.name} is called`, () => {
    const fakeConsultant = makeFakeCreateConsultantInput();

    it('should call repository with right params', async () => {
      const { sut, consultantRepository } = makeSut();
      const createSpy = consultantRepository.create;

      await sut.createConsultant(fakeConsultant);

      expect(createSpy).toBeCalledWith({
        ...makeFakeCreateConsultantInput(),
        commission: 1000,
      });
    });

    it('should return repository result', async () => {
      const { sut } = makeSut();

      const result = await sut.createConsultant(fakeConsultant);

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

      const result = await sut.createConsultant(consultant);

      expect(result).toEqual(makeFakeConsultant());
    });

    it('should throw when repository throws', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.create.mockRejectedValueOnce(
        new Error('any_create_error'),
      );

      const promise = sut.createConsultant(fakeConsultant);

      await expect(promise).rejects.toThrow(new Error('any_create_error'));
    });
  });

  describe(`When ${ConsultantService.prototype.updateConsultant.name} is called`, () => {
    const fakeId = 777;
    const fakeConsultant = makeFakeUpdateConsultantInput();

    it('should call repository with right params', async () => {
      const { sut, consultantRepository } = makeSut();
      const updateSpy = consultantRepository.update;

      await sut.updateConsultant(fakeId, fakeConsultant);

      expect(updateSpy).toBeCalledWith(777, {
        ...makeFakeUpdateConsultantInput(),
        commission: 1000,
      });
    });

    it('should throw when repository throws', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.update.mockRejectedValueOnce(
        new Error('any_update_error'),
      );

      const promise = sut.updateConsultant(fakeId, fakeConsultant);

      await expect(promise).rejects.toThrow(new Error('any_update_error'));
    });
  });

  describe(`When ${ConsultantService.prototype.deleteConsultant.name} is called`, () => {
    const fakeId = 777;

    it('should call repository with right params', async () => {
      const { sut, consultantRepository } = makeSut();
      const deleteSpy = consultantRepository.delete;

      await sut.deleteConsultant(fakeId);

      expect(deleteSpy).toBeCalledWith(777);
    });

    it('should throw when repository throws', async () => {
      const { sut, consultantRepository } = makeSut();
      consultantRepository.delete.mockRejectedValueOnce(
        new Error('any_delete_error'),
      );

      const promise = sut.deleteConsultant(fakeId);

      await expect(promise).rejects.toThrow(new Error('any_delete_error'));
    });
  });
});
