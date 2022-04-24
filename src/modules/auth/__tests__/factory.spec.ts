import MySqlDBClient from '../../../infra/mySql';
import { LoginController } from '../controller';
import * as factory from '../factories';

jest.mock('../../../adapters/joi/JoiAdapter');
jest.mock('../../../infra/mySql');
jest.mock('../controller');
jest.mock('../schemas');
jest.mock('../service');

MySqlDBClient.getInstance = jest.fn().mockReturnValue({
  getPrismaClientInstance: jest.fn().mockReturnValue({ auth: {} }),
});

const makeSut = () => {
  const sut = factory;

  return { sut };
};

describe(LoginController.name, () => {
  it('Should return a LoginController instance', () => {
    const { sut } = makeSut();

    const result = sut.createLoginController();

    expect(result).toBeInstanceOf(LoginController);
  });
});
