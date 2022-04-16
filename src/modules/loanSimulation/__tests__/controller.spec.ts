import { LoanSimulationController } from '../controller';
import { ILoanSimulationBasedOnRequestedValueParams } from '../interfaces';
import { loanSimulationOfDay15OfTheMonthWithTelemedicine } from './fixtures';
import {
  makeLoanSimulationServiceStub,
  makeValidatorStub,
  makeLoanSimulationBasedOnRequestedValueParams,
  makeFakeApiHttpRequest,
  makeFakeApiHttpResponse,
} from './helpers/test-helper';

const makeSut = (
  payload?: Partial<ILoanSimulationBasedOnRequestedValueParams>,
) => {
  const loanSimulationServiceStub = makeLoanSimulationServiceStub();
  const validatorStub = makeValidatorStub(
    makeLoanSimulationBasedOnRequestedValueParams({ ...payload }),
  );
  const sut = new LoanSimulationController(
    loanSimulationServiceStub,
    validatorStub,
  );
  return { sut, loanSimulationServiceStub, validatorStub };
};

describe(LoanSimulationController.name, () => {
  describe(`When ${LoanSimulationController.prototype.getLoanSimulationByRequestedValue.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const bodyParams = makeLoanSimulationBasedOnRequestedValueParams();
      const httpRequest = makeFakeApiHttpRequest({
        body: bodyParams,
      });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.getLoanSimulationByRequestedValue(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith(
        'GetLoanSimulationByRequestedValue',
        bodyParams,
      );
    });

    it('should call service with validation return', async () => {
      const { sut, loanSimulationServiceStub } = makeSut();
      const bodyParams = makeLoanSimulationBasedOnRequestedValueParams();
      const httpRequest = makeFakeApiHttpRequest({
        body: bodyParams,
      });
      const simulateLoanBasedOnRequestedValueSpy =
        loanSimulationServiceStub.simulateLoanBasedOnRequestedValue;

      await sut.getLoanSimulationByRequestedValue(httpRequest);

      expect(simulateLoanBasedOnRequestedValueSpy).toBeCalledWith(bodyParams);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const bodyParams = makeLoanSimulationBasedOnRequestedValueParams();
      const httpRequest = makeFakeApiHttpRequest({
        body: bodyParams,
      });

      const result = await sut.getLoanSimulationByRequestedValue(httpRequest);
      expect(result).toEqual(
        makeFakeApiHttpResponse(
          'OK',
          loanSimulationOfDay15OfTheMonthWithTelemedicine,
        ),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, loanSimulationServiceStub } = makeSut();
      const bodyParams = makeLoanSimulationBasedOnRequestedValueParams();
      const httpRequest = makeFakeApiHttpRequest({
        body: bodyParams,
      });
      loanSimulationServiceStub.simulateLoanBasedOnRequestedValue.mockRejectedValueOnce(
        new Error('any_get_consultants_by_id_error'),
      );

      const promise = sut.getLoanSimulationByRequestedValue(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_get_consultants_by_id_error'),
      );
    });

    it('should throw when validator throws', async () => {
      const { sut, validatorStub } = makeSut();
      const bodyParams = makeLoanSimulationBasedOnRequestedValueParams();
      const httpRequest = makeFakeApiHttpRequest({
        body: bodyParams,
      });
      validatorStub.validateSchema.mockImplementationOnce(() => {
        throw new Error('any_validate_schema_error');
      });

      const promise = sut.getLoanSimulationByRequestedValue(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });
});
