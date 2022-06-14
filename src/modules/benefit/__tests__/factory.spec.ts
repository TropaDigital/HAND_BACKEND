import MySqlDBClient from '../../../infra/mySql';
import { BenefitController } from '../controller';
import * as factory from '../factories';

jest.mock('../../../adapters/joi/JoiAdapter');
jest.mock('../../../infra/mySql');
jest.mock('../controller');
jest.mock('../repository');
jest.mock('../schemas');
jest.mock('../service');

MySqlDBClient.getInstance = jest.fn().mockReturnValue({
  getPrismaClientInstance: jest.fn().mockReturnValue({ benefit: {} }),
});

const makeSut = () => {
  const sut = factory;

  return { sut };
};

describe('BenefitControllerFactory', () => {
  it('Should return a BenefitController instance', () => {
    const { sut } = makeSut();

    const result = sut.createBenefitController();

    expect(result).toBeInstanceOf(BenefitController);
  });
});
