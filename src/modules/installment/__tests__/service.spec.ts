import { InstallmentRepository } from '../repository';
import { InstallmentService } from '../service';
import {
  makeFakeCreateInstallmentParams,
  makeInstallmentRepositoryStub,
} from './helpers/test-helper';

const makeSut = () => {
  const installmentRepository = makeInstallmentRepositoryStub();
  const sut = new InstallmentService(installmentRepository);

  return { sut, installmentRepository };
};

describe(InstallmentRepository.name, () => {
  const fakeParams = makeFakeCreateInstallmentParams();
  describe(`When ${InstallmentService.prototype.create.name} is called`, () => {
    it('should call repository with right params', async () => {
      const { sut, installmentRepository } = makeSut();
      const createSpy = installmentRepository.create;

      await sut.create(fakeParams);

      expect(createSpy).toBeCalledWith({
        admnistrationFeeValue: 2,
        bankProcessingFees: 10,
        cardFees: 10,
        consultantCommission: 2,
        createdBy: 'user',
        reference: 'abril/2022',
      });
    });

    it('should throw when repository throws', async () => {
      const { sut, installmentRepository } = makeSut();
      const createSpy = installmentRepository.create;
      createSpy.mockRejectedValueOnce(new Error('any create error'));

      const promise = sut.create(fakeParams);

      await expect(promise).rejects.toThrow(new Error('any create error'));
    });
  });

  describe(`When ${InstallmentService.prototype.update.name} is called`, () => {
    it('should call repository with right params', async () => {
      const { sut, installmentRepository } = makeSut();
      const createSpy = installmentRepository.softUpdate;

      await sut.update(1, { ...fakeParams, user: 'user' });

      expect(createSpy).toBeCalledWith(1, {
        admnistrationFeeValue: 2,
        bankProcessingFees: 10,
        cardFees: 10,
        consultantCommission: 2,
        createdBy: 'user',
        reference: 'abril/2022',
        user: 'user',
      });
    });

    it('should throw when repository throws', async () => {
      const { sut, installmentRepository } = makeSut();
      const createSpy = installmentRepository.softUpdate;
      createSpy.mockRejectedValueOnce(new Error('any create error'));

      const promise = sut.update(1, { ...fakeParams, user: 'user' });

      await expect(promise).rejects.toThrow(new Error('any create error'));
    });
  });
});
