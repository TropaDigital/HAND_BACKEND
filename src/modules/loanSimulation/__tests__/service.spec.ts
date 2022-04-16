import { startOfDay } from 'date-fns';

import { NotFoundError } from '../../../shared/errors';
import { makeConsultantServiceStub } from '../../consultant/__tests__/helpers/test-helper';
import { LoanSimulationService } from '../service';
import {
  loanSimulationOfDay15OfTheMonthWithoutTelemedicine,
  loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDay,
  loanSimulationOfDay15OfTheMonthWithTelemedicine,
  loanSimulationOfDay15OfTheMonthWithTenPercentOfCommission,
  loanSimulationOfDay16OfTheMonth,
} from './fixtures';
import { makeLoanSimulationBasedOnRequestedValueParams } from './helpers/test-helper';

const makeSut = () => {
  const consultantService = makeConsultantServiceStub();
  const sut = new LoanSimulationService(consultantService);

  return { sut, consultantService };
};

describe(LoanSimulationService.name, () => {
  describe(`When ${LoanSimulationService.prototype.simulateLoanBasedOnRequestedValue.name} is called`, () => {
    test.each([
      {
        params: makeLoanSimulationBasedOnRequestedValueParams(),
        expected: loanSimulationOfDay15OfTheMonthWithTelemedicine,
      },
      {
        params: makeLoanSimulationBasedOnRequestedValueParams({
          joinedTelemedicine: false,
        }),
        expected: loanSimulationOfDay15OfTheMonthWithoutTelemedicine,
      },
      {
        params: makeLoanSimulationBasedOnRequestedValueParams({
          joinedTelemedicine: false,
          salaryReceiptDate: undefined,
        }),
        expected:
          loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDay,
      },
      {
        params: makeLoanSimulationBasedOnRequestedValueParams({
          salaryReceiptDate: startOfDay(new Date('2022-04-15T12:00:00.900Z')),
        }),
        expected: loanSimulationOfDay16OfTheMonth,
        overrideSystemTime: () => {
          jest
            .useFakeTimers()
            .setSystemTime(
              startOfDay(new Date('2022-04-16T12:00:00.900Z')).getTime(),
            );
        },
      },
    ])(
      'should return the details of loan simulation when provide $params as params',
      async ({ params, expected, overrideSystemTime }) => {
        if (overrideSystemTime) {
          overrideSystemTime();
        }
        const { sut } = makeSut();
        const result = await sut.simulateLoanBasedOnRequestedValue(params);
        expect(result).toEqual(expected);
      },
    );

    it('should call consultantService.getById with correct parameters', async () => {
      const { sut, consultantService } = makeSut();
      await sut.simulateLoanBasedOnRequestedValue(
        makeLoanSimulationBasedOnRequestedValueParams({
          consultantId: 1,
        }),
      );
      expect(consultantService.getById).toBeCalledWith(1);
    });

    it('should return the loan simulation with consultant commission when provide consultantId that exists', async () => {
      const { sut } = makeSut();
      const result = await sut.simulateLoanBasedOnRequestedValue(
        makeLoanSimulationBasedOnRequestedValueParams({
          consultantId: 1,
        }),
      );
      expect(result).toEqual(
        loanSimulationOfDay15OfTheMonthWithTenPercentOfCommission,
      );
    });

    it('should return the loan simulation with consultant commission when provide consultantId that exists', async () => {
      const { sut, consultantService } = makeSut();
      const notFoundError = new NotFoundError(
        'consultant not found with provided id',
      );
      consultantService.getById.mockRejectedValueOnce(notFoundError);
      await expect(
        sut.simulateLoanBasedOnRequestedValue(
          makeLoanSimulationBasedOnRequestedValueParams({
            consultantId: 1,
          }),
        ),
      ).rejects.toThrow(notFoundError);
    });
  });
});
