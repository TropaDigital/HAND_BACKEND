import MySqlDBClient from '../../../infra/mySql';
import { UserController } from '../controller';
import * as factory from '../factories';

jest.mock('../../../adapters/joi/JoiAdapter');
jest.mock('../../../infra/mySql');
jest.mock('../controller');
jest.mock('../repository');
jest.mock('../schemas');
jest.mock('../service');

MySqlDBClient.getInstance = jest.fn().mockReturnValue({
  getPrismaClientInstance: jest.fn().mockReturnValue({ user: {} }),
});

const makeSut = () => {
  const sut = factory;

  return { sut };
};

describe('UserControllerFactory', () => {
  it('Should return a UserController instance', () => {
    const { sut } = makeSut();

    const result = sut.createUserController();

    expect(result).toBeInstanceOf(UserController);
  });
});
