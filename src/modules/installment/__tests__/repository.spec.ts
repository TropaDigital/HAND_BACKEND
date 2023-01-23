import { InstallmentRepository } from '../repository';
import {
  makeFakeCreateInstallmentParams,
  makePrismaClient,
} from './helpers/test-helper';

const makeSut = () => {
  const { prismaClient, prismaInstallmentRepository } = makePrismaClient();
  const sut = new InstallmentRepository(prismaClient);

  return { sut, prismaInstallmentRepository };
};

describe(InstallmentRepository.name, () => {
  describe(`When ${InstallmentRepository.prototype.findAll} is called`, () => {
    it('Should call prisma with right params', async () => {
      const { sut, prismaInstallmentRepository } = makeSut();

      await sut.findAll();

      expect(prismaInstallmentRepository.findMany).toBeCalledWith({
        orderBy: {
          referenceDate: 'asc',
        },
        where: { benefitId: undefined },
      });
    });

    it('Should throw when prisma throws', async () => {
      const { sut, prismaInstallmentRepository } = makeSut();
      prismaInstallmentRepository.findMany.mockRejectedValueOnce(
        new Error('any prisma error'),
      );

      const promise = sut.findAll();

      await expect(promise).rejects.toThrow(new Error('any prisma error'));
    });
  });
  describe(`When ${InstallmentRepository.prototype.createMany} is called`, () => {
    it('Should call prisma with right params', async () => {
      const { sut, prismaInstallmentRepository } = makeSut();
      const fakeParams = [makeFakeCreateInstallmentParams()];

      await sut.createMany(fakeParams);

      expect(prismaInstallmentRepository.createMany).toBeCalledWith({
        data: [
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
        ],
      });
    });

    it('Should throw when prisma throws', async () => {
      const { sut, prismaInstallmentRepository } = makeSut();
      const fakeParams = [makeFakeCreateInstallmentParams()];
      prismaInstallmentRepository.createMany.mockRejectedValueOnce(
        new Error('any prisma error'),
      );

      const promise = sut.createMany(fakeParams);

      await expect(promise).rejects.toThrow(new Error('any prisma error'));
    });
  });

  describe(`When ${InstallmentRepository.prototype.findByBenefitIdAndReference} is called`, () => {
    it('Should call prisma with right params', async () => {
      const { sut, prismaInstallmentRepository } = makeSut();

      await sut.findByBenefitIdAndReference(
        1,
        new Date('2022-10-10').toString(),
      );

      expect(prismaInstallmentRepository.findFirst).toBeCalledWith({
        where: {
          reference: new Date('2022-10-10').toString(),
          benefitId: 1,
          status: { not: 'CANCELED' },
        },
      });
    });

    it('Should throw when prisma throws', async () => {
      const { sut, prismaInstallmentRepository } = makeSut();
      prismaInstallmentRepository.findFirst.mockRejectedValueOnce(
        new Error('any prisma error'),
      );

      const promise = sut.findByBenefitIdAndReference(
        1,
        new Date('2022-10-10').toString(),
      );

      await expect(promise).rejects.toThrow(new Error('any prisma error'));
    });
  });

  describe(`When ${InstallmentRepository.prototype.disable} is called`, () => {
    it('Should call prisma with right params', async () => {
      const { sut, prismaInstallmentRepository } = makeSut();

      await sut.disable(1, 'user');

      expect(prismaInstallmentRepository.update).toBeCalledWith({
        data: {
          updatedAt: expect.anything(),
          updatedBy: 'user',
          status: 'CANCELED',
        },
        where: { id: 1 },
      });
    });

    it('Should throw when prisma throws', async () => {
      const { sut, prismaInstallmentRepository } = makeSut();
      prismaInstallmentRepository.update.mockRejectedValueOnce(
        new Error('any prisma error'),
      );

      const promise = sut.disable(1, 'user');

      await expect(promise).rejects.toThrow(new Error('any prisma error'));
    });
  });

  describe(`When ${InstallmentRepository.prototype.softUpdate} is called`, () => {
    it('Should call prisma with right params', async () => {
      const { sut, prismaInstallmentRepository } = makeSut();
      const fakeParams = makeFakeCreateInstallmentParams();

      await sut.softUpdate(1, { ...fakeParams, user: 'user' });

      expect(prismaInstallmentRepository.update).toBeCalledWith({
        data: {
          updatedAt: expect.anything(),
          updatedBy: 'user',
          status: 'CANCELED',
        },
        where: { id: 1 },
      });
      expect(prismaInstallmentRepository.create).toBeCalledWith({
        data: {
          ...fakeParams,
        },
      });
    });
  });
});
