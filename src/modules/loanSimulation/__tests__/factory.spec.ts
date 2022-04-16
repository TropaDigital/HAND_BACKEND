import MySqlDBClient from '../../../infra/mySql';
import { LoanSimulationController } from '../controller';
import * as factory from '../factories';

jest.mock('../../../adapters/joi/JoiAdapter');
jest.mock('../../../infra/mySql');
jest.mock('../controller');
jest.mock('../schemas');
jest.mock('../service');

MySqlDBClient.getInstance = jest.fn().mockReturnValue({
  getPrismaClientInstance: jest.fn().mockReturnValue({ loanSimulation: {} }),
});

const makeSut = () => {
  const sut = factory;

  return { sut };
};

describe('LoanSimulationControllerFactory', () => {
  it('Should return a LoanSimulationController instance', () => {
    const { sut } = makeSut();

    const result = sut.createLoanSimulationController();

    expect(result).toBeInstanceOf(LoanSimulationController);
  });
});
