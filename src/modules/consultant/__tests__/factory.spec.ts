import MySqlDBClient from '../../../infra/mySql';
import { ConsultantController } from '../controller';
import * as factory from '../factories';

jest.mock('../../../adapters/joi/JoiAdapter');
jest.mock('../../../infra/mySql');
jest.mock('../controller');
jest.mock('../repository');
jest.mock('../schemas');
jest.mock('../service');

MySqlDBClient.getInstance = jest.fn().mockReturnValue({
  getPrismaClientInstance: jest.fn().mockReturnValue({ consultant: {} }),
});

const makeSut = () => {
  const sut = factory;

  return { sut };
};

describe('ConsultantControllerFactory', () => {
  it('Should return a ConsultantController instance', () => {
    const { sut } = makeSut();

    const result = sut.createConsultantController();

    expect(result).toBeInstanceOf(ConsultantController);
  });
});
