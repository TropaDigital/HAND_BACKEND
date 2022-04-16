/* eslint-disable import/no-duplicates */
import {
  getDaysInMonth,
  getDate,
  getMonth,
  addMonths,
  format,
  addDays,
  isAfter,
  setMonth,
  startOfDay,
} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { IConsultantService } from '../consultant/interfaces';
import { loanConfig } from './consts';
import {
  IFormatInstallmentParams,
  IFormatLoanSimulationBasedOnRequestedValueParams,
  IInstallmentDetails,
  ILoanSimulationBasedOnRequestedValue,
  ILoanSimulationBasedOnRequestedValueParams,
  ILoanSimulationService,
} from './interfaces';

export class LoanSimulationService implements ILoanSimulationService {
  constructor(private readonly consultantService: IConsultantService) {}

  private getNumberOfDaysOfTheMonth(date: number | Date): number {
    return getDaysInMonth(date);
  }

  private getConsultantCommissionValueByRequestedValue(
    requestedValue: number,
    consultantCommission: number,
  ): number {
    return requestedValue * (consultantCommission / 100);
  }

  private getRemainingDaysOfMonth(date: number | Date): number {
    return this.getNumberOfDaysOfTheMonth(date) - getDate(date);
  }

  private getFeesOfMonth(date: number | Date): number {
    if (getMonth(date) === getMonth(new Date())) {
      return (this.getRemainingDaysOfMonth(date) * loanConfig.fees) / 100 / 100;
    }

    return (this.getNumberOfDaysOfTheMonth(date) * loanConfig.fees) / 100 / 100;
  }

  private getInstallmentsFactorValueByRequestedValue(
    requestedValue: number,
    numberOfInstallments: number,
  ): number {
    return requestedValue * loanConfig.factorTable[numberOfInstallments - 1];
  }

  private getInstallmentWithAditionalValues(
    installmentsFactorValue: number,
    joinedTelemedicine: boolean,
  ): number {
    return (
      installmentsFactorValue +
      loanConfig.bankProcessingFee +
      loanConfig.cardValue +
      (joinedTelemedicine ? loanConfig.optionals.telemedicineValue : 0)
    );
  }

  private formatInstallmentDetails({
    currentDate,
    requestedValue,
    numberOfInstallments,
    joinedTelemedicine,
    consultantCommission,
  }: IFormatInstallmentParams & { currentDate: Date }): IInstallmentDetails {
    const installmentFactor = this.getInstallmentsFactorValueByRequestedValue(
      requestedValue,
      numberOfInstallments,
    );
    const consultantCommissionValueByInstallment =
      this.getConsultantCommissionValueByRequestedValue(
        requestedValue,
        consultantCommission,
      ) / numberOfInstallments;
    const fees = this.getFeesOfMonth(currentDate);
    const installmentValueWithFees = installmentFactor * (fees + 1);
    const installmentFinalValue =
      this.getInstallmentWithAditionalValues(
        installmentValueWithFees,
        joinedTelemedicine,
      ) + consultantCommissionValueByInstallment;
    return {
      reference: `${format(currentDate, 'MMMM', { locale: ptBR })}/${format(
        currentDate,
        'yyyy',
      )}`,
      cardFees: this.getCardFees(1),
      telemedicineFees: this.getTelemedicineFees(joinedTelemedicine, 1),
      bankProcessingFees: this.getbankProcessingFees(1),
      installmentFactor,
      consultantCommission,
      consultantCommissionValue: consultantCommissionValueByInstallment,
      fees: parseFloat((fees * 100).toFixed(2)),
      feesValue: parseFloat((fees * installmentFactor).toFixed(2)),
      finalValue: parseFloat(installmentFinalValue.toFixed(2)),
    };
  }

  private getInstallmentsDetails({
    requestedValue,
    numberOfInstallments,
    joinedTelemedicine,
    consultantCommission,
  }: IFormatInstallmentParams): IInstallmentDetails[] {
    let currentDate = startOfDay(new Date());
    const blankInstallments = new Array(numberOfInstallments).fill(0);
    return blankInstallments.map(() => {
      const formatedInstallment = this.formatInstallmentDetails({
        currentDate,
        requestedValue,
        numberOfInstallments,
        joinedTelemedicine,
        consultantCommission,
      });
      currentDate = addMonths(currentDate, 1);
      return formatedInstallment;
    });
  }

  private getMaxInstallmentValueBySalary(salary: number): number {
    return salary * (35 / 100);
  }

  private isRequestedValueValid(
    installments: IInstallmentDetails[],
    maxInstallmentValueBySalary: number,
  ): boolean {
    return installments.every(
      installment => installment.finalValue <= maxInstallmentValueBySalary,
    );
  }

  private getCardFees(numberOfInstallments: number): number {
    return numberOfInstallments * loanConfig.cardValue;
  }

  private getbankProcessingFees(numberOfInstallments: number): number {
    return numberOfInstallments * loanConfig.bankProcessingFee;
  }

  private getTelemedicineFees(
    joinedTelemedicine: boolean,
    numberOfInstallments: number,
  ): number {
    return joinedTelemedicine
      ? numberOfInstallments * loanConfig.optionals.telemedicineValue
      : 0;
  }

  private getFirstPaymentDates(salaryReceiptDate?: Date): Date[] {
    if (!salaryReceiptDate) {
      return [];
    }
    const now = startOfDay(new Date());
    const formatedSalaryReceiptDate = startOfDay(salaryReceiptDate);
    const finalPaymentDate = addDays(now, 60);
    const dates: Date[] = [];

    if (isAfter(salaryReceiptDate, now)) {
      dates.push(setMonth(formatedSalaryReceiptDate, now.getMonth()));
    }

    if (!isAfter(addMonths(formatedSalaryReceiptDate, 1), finalPaymentDate)) {
      dates.push(addMonths(formatedSalaryReceiptDate, 1));
    }

    if (!isAfter(addMonths(formatedSalaryReceiptDate, 2), finalPaymentDate)) {
      dates.push(addMonths(formatedSalaryReceiptDate, 2));
    }

    return [...dates, finalPaymentDate];
  }

  private getTotalInstallmentsFees(
    installments: IInstallmentDetails[],
  ): Pick<
    ILoanSimulationBasedOnRequestedValue,
    | 'cardFees'
    | 'bankProcessingFees'
    | 'telemedicineFees'
    | 'totalValue'
    | 'feesValue'
  > {
    return installments.reduce(
      (result, installment) => {
        return {
          feesValue: result.feesValue + installment.feesValue,
          cardFees: result.cardFees + installment.cardFees,
          bankProcessingFees:
            result.bankProcessingFees + installment.bankProcessingFees,
          totalValue: result.totalValue + installment.finalValue,
          telemedicineFees:
            result.telemedicineFees + installment.telemedicineFees,
        };
      },
      {
        telemedicineFees: 0,
        feesValue: 0,
        cardFees: 0,
        bankProcessingFees: 0,
        totalValue: 0,
      },
    );
  }

  private formatLoanSimulationBasedOnRequestedValue({
    salary,
    salaryReceiptDate,
    requestedValue,
    consultantCommission,
    installments,
  }: IFormatLoanSimulationBasedOnRequestedValueParams): ILoanSimulationBasedOnRequestedValue {
    const maxInstallmentValueBySalary =
      this.getMaxInstallmentValueBySalary(salary);
    return {
      salary,
      maxInstallmentValueBySalary,
      consultantCommission,
      firstPaymentDates: this.getFirstPaymentDates(salaryReceiptDate),
      consultantCommissionValue:
        this.getConsultantCommissionValueByRequestedValue(
          requestedValue,
          consultantCommission,
        ),
      isRequestedValueValid: this.isRequestedValueValid(
        installments,
        maxInstallmentValueBySalary,
      ),
      ...this.getTotalInstallmentsFees(installments),
      installments,
    };
  }

  public async simulateLoanBasedOnRequestedValue({
    salary,
    salaryReceiptDate,
    requestedValue,
    numberOfInstallments,
    joinedTelemedicine,
    consultantId,
  }: ILoanSimulationBasedOnRequestedValueParams): Promise<ILoanSimulationBasedOnRequestedValue> {
    let consultantCommission = 0;
    if (consultantId) {
      consultantCommission = (
        await this.consultantService.getById(consultantId)
      ).commission;
    }

    const installments = this.getInstallmentsDetails({
      requestedValue,
      numberOfInstallments,
      joinedTelemedicine,
      consultantCommission,
    });

    return this.formatLoanSimulationBasedOnRequestedValue({
      salary,
      salaryReceiptDate,
      requestedValue,
      installments,
      consultantCommission,
    });
  }
}
