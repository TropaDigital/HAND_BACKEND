import MySqlDBClient from '../../../infra/mySql';
import { RoleController } from '../controller';
import * as factory from '../factories';

jest.mock('../../../adapters/joi/JoiAdapter');
jest.mock('../../../infra/mySql');
jest.mock('../controller');
jest.mock('../repository');
jest.mock('../schemas');
jest.mock('../service');

MySqlDBClient.getInstance = jest.fn().mockReturnValue({
  getPrismaClientInstance: jest.fn().mockReturnValue({ role: {} }),
});

const makeSut = () => {
  const sut = factory;

  return { sut };
};

describe('RoleControllerFactory', () => {
  it('Should return a RoleController instance', () => {
    const { sut } = makeSut();

    const result = sut.createRoleController();

    expect(result).toBeInstanceOf(RoleController);
  });
});
