import { MonthOfPayment } from 'src/enums/MonthOfPayment';

import { IApiHttpRequest, IApiHttpResponse } from '../../interfaces/http';

export interface IFormatInstallmentParams {
  administrationFeeValue?: number;
  hasGratification: boolean;
  requestedValue: number;
  numberOfInstallments: number;
  joinedTelemedicine: boolean;
  consultantCommission: number;
  monthOfPayment: MonthOfPayment;
}

export interface ILoanSimulationBasedOnRequestedValueParams {
  administrationFeeValue?: number;
  hasGratification: boolean;
  salary: number;
  salaryReceiptDate: Date;
  requestedValue: number;
  numberOfInstallments: number;
  joinedTelemedicine: boolean;
  consultantId?: number;
  monthOfPayment: MonthOfPayment;
}

export interface IInstallmentDetails {
  reference: string;
  installmentFactor: number;
  consultantCommission: number;
  consultantCommissionValue: number;
  cardFees: number;
  telemedicineFees: number;
  bankProcessingFees: number;
  fees: number;
  feesValue: number;
  finalValue: number;
  gratificationFeeValue?: number;
  admnistrationFeeValue?: number;
}

export interface ILoanSimulationBasedOnRequestedValue {
  requestedValue: number;
  totalValue: number;
  salary: number;
  feesValue: number;
  cardFees: number;
  telemedicineFees: number;
  bankProcessingFees: number;
  firstPaymentDates: Date[];
  maxInstallmentValueBySalary: number;
  consultantCommission: number;
  consultantCommissionValue: number;
  isRequestedValueValid: boolean;
  installments: IInstallmentDetails[];
}

export interface IFormatLoanSimulationBasedOnRequestedValueParams {
  salary: number;
  salaryReceiptDate?: Date;
  requestedValue: number;
  consultantCommission: number;
  installments: IInstallmentDetails[];
}

export interface ILoanSimulationController {
  getLoanSimulationByRequestedValue(
    httpRequest: IApiHttpRequest<ILoanSimulationBasedOnRequestedValueParams>,
  ): Promise<IApiHttpResponse<ILoanSimulationBasedOnRequestedValue>>;
}

export interface ILoanSimulationService {
  simulateLoanBasedOnRequestedValue: ({
    salary,
    salaryReceiptDate,
    requestedValue,
    numberOfInstallments,
    joinedTelemedicine,
    consultantId,
  }: ILoanSimulationBasedOnRequestedValueParams) => Promise<ILoanSimulationBasedOnRequestedValue>;
}
