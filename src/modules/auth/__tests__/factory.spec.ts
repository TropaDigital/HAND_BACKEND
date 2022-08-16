import MySqlDBClient from '../../../infra/mySql';
import { AuthController } from '../controller';
import * as factory from '../factories';

jest.mock('../../../adapters/joi/JoiAdapter');
jest.mock('../../../infra/mySql');
jest.mock('../controller');
jest.mock('../schemas');
jest.mock('../service');
jest.mock('../../../shared/mailer');

MySqlDBClient.getInstance = jest.fn().mockReturnValue({
  getPrismaClientInstance: jest.fn().mockReturnValue({ auth: {} }),
});

const makeSut = () => {
  const sut = factory;

  return { sut };
};

describe(AuthController.name, () => {
  it('Should return a LoginController instance', () => {
    const { sut } = makeSut();

    const result = sut.createAuthController();

    expect(result).toBeInstanceOf(AuthController);
  });
});
