import MySqlDBClient from '../../../infra/mySql';
import { AffiliationController } from '../controller';
import * as factory from '../factories';

jest.mock('../../../adapters/joi/JoiAdapter');
jest.mock('../../../infra/mySql');
jest.mock('../controller');
jest.mock('../repository');
jest.mock('../schemas');
jest.mock('../service');

MySqlDBClient.getInstance = jest.fn().mockReturnValue({
  getPrismaClientInstance: jest.fn().mockReturnValue({ affiliation: {} }),
});

const makeSut = () => {
  const sut = factory;

  return { sut };
};

describe('AffiliationControllerFactory', () => {
  it('Should return a AffiliationController instance', () => {
    const { sut } = makeSut();

    const result = sut.createAffiliationController();

    expect(result).toBeInstanceOf(AffiliationController);
  });
});
