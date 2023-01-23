import { startOfDay } from 'date-fns';

import { MonthOfPayment } from '../../../enums/MonthOfPayment';
import { NotFoundError } from '../../../shared/errors';
import { makeConsultantServiceStub } from '../../consultant/__tests__/helpers/test-helper';
import { LoanSimulationService } from '../service';
import {
  loanSimulationOfDay15OfTheMonthWithoutTelemedicine,
  loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDay,
  loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDayCurrentMonth,
  loanSimulationOfDay15OfTheMonthWithoutTelemedicineLastMonthPayment,
  loanSimulationOfDay15OfTheMonthWithoutTelemedicineLastMonthPaymentRequestedValueLowerThan1000,
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
    beforeEach(() => {
      jest
        .useFakeTimers()
        .setSystemTime(
          startOfDay(new Date('2022-04-15T12:00:00.000Z')).getTime(),
        );
    });

    test.each([
      {
        name: 'loanSimulationOfDay15OfTheMonthWithTelemedicine',
        params: makeLoanSimulationBasedOnRequestedValueParams({
          monthOfPayment: MonthOfPayment.NEXT_MONTH,
        }),
        expected: loanSimulationOfDay15OfTheMonthWithTelemedicine,
      },
      {
        name: 'loanSimulationOfDay15OfTheMonthWithoutTelemedicine',
        params: makeLoanSimulationBasedOnRequestedValueParams({
          joinedTelemedicine: false,
          monthOfPayment: MonthOfPayment.NEXT_MONTH,
        }),
        expected: loanSimulationOfDay15OfTheMonthWithoutTelemedicine,
      },
      {
        name: 'loanSimulationOfDay15OfTheMonthWithoutTelemedicineLastMonthPayment',
        params: makeLoanSimulationBasedOnRequestedValueParams({
          joinedTelemedicine: false,
          monthOfPayment: MonthOfPayment.LAST_MONTH,
        }),
        expected:
          loanSimulationOfDay15OfTheMonthWithoutTelemedicineLastMonthPayment,
      },
      {
        name: 'loanSimulationOfDay15OfTheMonthWithoutTelemedicineLastMonthPaymentRequestedValueLowerThan1000',
        params: makeLoanSimulationBasedOnRequestedValueParams({
          joinedTelemedicine: false,
          requestedValue: 800,
          monthOfPayment: MonthOfPayment.LAST_MONTH,
        }),
        expected:
          loanSimulationOfDay15OfTheMonthWithoutTelemedicineLastMonthPaymentRequestedValueLowerThan1000,
      },
      {
        name: 'loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDay',
        params: makeLoanSimulationBasedOnRequestedValueParams({
          joinedTelemedicine: false,
          salaryReceiptDate: undefined,
          monthOfPayment: MonthOfPayment.NEXT_MONTH,
        }),
        expected:
          loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDay,
      },
      {
        name: 'loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDayCurrentMonth',
        params: makeLoanSimulationBasedOnRequestedValueParams({
          joinedTelemedicine: false,
          salaryReceiptDate: undefined,
        }),
        expected:
          loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDayCurrentMonth,
      },
      {
        name: 'loanSimulationOfDay16OfTheMonth',
        params: makeLoanSimulationBasedOnRequestedValueParams({
          salaryReceiptDate: startOfDay(new Date('2022-04-15T12:00:00.900Z')),
          monthOfPayment: MonthOfPayment.NEXT_MONTH,
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
      'should return $name when provide $params as params',
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
          monthOfPayment: MonthOfPayment.NEXT_MONTH,
          hasGratification: false,
        }),
      );

      expect(result).toEqual(
        loanSimulationOfDay15OfTheMonthWithTenPercentOfCommission,
      );
    });

    it('should return the loan simulation with consultant commission when provide consultantId that does not exists', async () => {
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
