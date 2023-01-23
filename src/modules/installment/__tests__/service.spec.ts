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
  const fakeParams = [makeFakeCreateInstallmentParams()];
  describe(`When ${InstallmentService.prototype.createMany.name} is called`, () => {
    it('should call repository with right params', async () => {
      const { sut, installmentRepository } = makeSut();
      const createSpy = installmentRepository.createMany;

      await sut.createMany(fakeParams);

      expect(createSpy).toBeCalledWith([
        {
          admnistrationFeeValue: 2,
          bankProcessingFees: 10,
          cardFees: 10,
          consultantCommission: 2,
          createdBy: 'user',
          dueDate: expect.anything(),
          reference: 'abril/2022',
          referenceDate: new Date('2022-10-10'),
        },
      ]);
    });

    it('should throw when repository throws', async () => {
      const { sut, installmentRepository } = makeSut();
      const createSpy = installmentRepository.createMany;
      createSpy.mockRejectedValueOnce(new Error('any create error'));

      const promise = sut.createMany(fakeParams);

      await expect(promise).rejects.toThrow(new Error('any create error'));
    });
  });

  describe(`When ${InstallmentService.prototype.update.name} is called`, () => {
    it('should call repository with right params', async () => {
      const { sut, installmentRepository } = makeSut();
      const createSpy = installmentRepository.softUpdate;

      await sut.update(1, { ...fakeParams[0], user: 'user' });

      expect(createSpy).toBeCalledWith(1, {
        admnistrationFeeValue: 2,
        bankProcessingFees: 10,
        cardFees: 10,
        consultantCommission: 2,
        dueDate: expect.anything(),
        createdBy: 'user',
        reference: 'abril/2022',
        user: 'user',
        referenceDate: new Date('2022-10-10'),
      });
    });

    it('should throw when repository throws', async () => {
      const { sut, installmentRepository } = makeSut();
      const createSpy = installmentRepository.softUpdate;
      createSpy.mockRejectedValueOnce(new Error('any create error'));

      const promise = sut.update(1, { ...fakeParams[0], user: 'user' });

      await expect(promise).rejects.toThrow(new Error('any create error'));
    });
  });
});
