import { startOfDay } from 'date-fns';
import { StatusCodes } from 'http-status-codes';

import { MonthOfPayment } from '../../../../enums/MonthOfPayment';
import { IApiHttpRequest, IApiHttpResponse } from '../../../../interfaces/http';
import { IValidator } from '../../../../interfaces/validation/IValidator';
import {
  ILoanSimulationBasedOnRequestedValueParams,
  ILoanSimulationService,
} from '../../interfaces';
import { loanSimulationOfDay15OfTheMonthWithTelemedicine } from '../fixtures';

export const makeFakeApiHttpRequest = ({
  body,
  params,
  headers,
}: {
  body?: unknown;
  params?: { [key: string]: unknown };
  headers?: { [key: string]: string | string[] | undefined };
}): jest.Mocked<IApiHttpRequest> => ({ body, params, headers });

export const makeFakeApiHttpResponse = (
  status: keyof typeof StatusCodes,
  body?: unknown,
): jest.Mocked<IApiHttpResponse> => ({
  body,
  statusCodeAsString: status || 'OK',
});

export const makeLoanSimulationServiceStub =
  (): jest.Mocked<ILoanSimulationService> => ({
    formatReferenceDate: jest.fn(),
    simulateLoanBasedOnRequestedValue: jest
      .fn()
      .mockResolvedValue(loanSimulationOfDay15OfTheMonthWithTelemedicine),
  });

export const makeValidatorStub = (
  payload: Partial<ILoanSimulationBasedOnRequestedValueParams>,
): jest.Mocked<IValidator> => ({
  validateSchema: jest.fn().mockReturnValue({ ...payload }),
});

export const makeLoanSimulationBasedOnRequestedValueParams = (
  payload?: Partial<ILoanSimulationBasedOnRequestedValueParams>,
): ILoanSimulationBasedOnRequestedValueParams => ({
  hasGratification: false,
  administrationFeeValue: 0,
  salary: 1500,
  salaryReceiptDate: startOfDay(
    new Date('Sat Apr 30 2022 19:02:39 GMT-0300 (Horário Padrão de Brasília)'),
  ),
  requestedValue: 1000,
  numberOfInstallments: 8,
  joinedTelemedicine: true,
  monthOfPayment: MonthOfPayment.CURRENT_MONTH,
  ...payload,
});
