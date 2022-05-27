import MySqlDBClient from '../../../infra/mySql';
import { AssociatedController } from '../controller';
import * as factory from '../factories';

jest.mock('../../../adapters/joi/JoiAdapter');
jest.mock('../../../infra/mySql');
jest.mock('../controller');
jest.mock('../repository');
jest.mock('../schemas');
jest.mock('../service');

MySqlDBClient.getInstance = jest.fn().mockReturnValue({
  getPrismaClientInstance: jest.fn().mockReturnValue({ associated: {} }),
});

const makeSut = () => {
  const sut = factory;

  return { sut };
};

describe('AssociatedControllerFactory', () => {
  it('Should return a AssociatedController instance', () => {
    const { sut } = makeSut();

    const result = sut.createAssociatedController();

    expect(result).toBeInstanceOf(AssociatedController);
  });
});
