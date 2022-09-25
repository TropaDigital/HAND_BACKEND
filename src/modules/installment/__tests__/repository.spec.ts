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
  describe(`When ${InstallmentRepository.prototype.create} is called`, () => {
    it('Should call prisma with right params', async () => {
      const { sut, prismaInstallmentRepository } = makeSut();
      const fakeParams = makeFakeCreateInstallmentParams();

      await sut.create(fakeParams);

      expect(prismaInstallmentRepository.create).toBeCalledWith({
        data: {
          admnistrationFeeValue: 2,
          bankProcessingFees: 10,
          cardFees: 10,
          consultantCommission: 2,
          createdBy: 'user',
          reference: 'abril/2022',
        },
      });
    });
  });

  describe(`When ${InstallmentRepository.prototype.findById} is called`, () => {
    it('Should call prisma with right params', async () => {
      const { sut, prismaInstallmentRepository } = makeSut();

      await sut.findById(1);

      expect(prismaInstallmentRepository.findFirst).toBeCalledWith({
        where: { disabledAt: null, disabledBy: null, id: 1 },
      });
    });
  });

  describe(`When ${InstallmentRepository.prototype.findById} is called`, () => {
    it('Should call prisma with right params', async () => {
      const { sut, prismaInstallmentRepository } = makeSut();

      await sut.findById(1);

      expect(prismaInstallmentRepository.findFirst).toBeCalledWith({
        where: { disabledAt: null, disabledBy: null, id: 1 },
      });
    });
  });
});
