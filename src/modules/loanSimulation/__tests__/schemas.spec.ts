import JoiAdapter from '../../../adapters/joi/JoiAdapter';
import * as schemas from '../schemas';
import { makeLoanSimulationBasedOnRequestedValueParams } from './helpers/test-helper';

const makeSut = () => {
  const sut = new JoiAdapter(schemas);

  return { sut };
};

describe('Schema', () => {
  describe('GetLoanSimulationByRequestedValue', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const params = makeLoanSimulationBasedOnRequestedValueParams();

      const result = sut.validateSchema(
        'GetLoanSimulationByRequestedValue',
        params,
      );

      expect(result).toEqual(params);
    });

    it('should return error when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = {};

      expect(() =>
        sut.validateSchema('GetLoanSimulationByRequestedValue', param),
      ).toThrow(new Error('Missing or invalid param'));
    });
  });
});
