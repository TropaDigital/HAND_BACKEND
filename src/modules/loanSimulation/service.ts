/* eslint-disable import/no-duplicates */
import {
  getDaysInMonth,
  getDate,
  addMonths,
  format,
  addDays,
  isAfter,
  setMonth,
  startOfDay,
  setDate,
} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { MonthOfPayment } from '../../enums/MonthOfPayment';
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
    return (this.getRemainingDaysOfMonth(date) * loanConfig.fees) / 100 / 100;
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

  public formatReferenceDate(date: Date): string {
    return `${format(date, 'MMMM', { locale: ptBR })}/${format(date, 'yyyy')}`;
  }

  private getAditionalValueWhenTheRequestValueIsLowerThan1000(
    requestedValue: number,
    numberOfInstallments: number,
  ): number {
    return requestedValue < 1000
      ? loanConfig.aditionalValueWhenTheValueIsLowerThan1000 /
      numberOfInstallments
      : 0;
  }

  private getFeesByMonthOfPayment(
    currentDate: Date,
    monthOfPayment: MonthOfPayment,
  ) {
    if (monthOfPayment === MonthOfPayment.CURRENT_MONTH) {
      return 0;
    }

    if (monthOfPayment === MonthOfPayment.LAST_MONTH) {
      // TODO: validar se a regra realmente vai ser 10% ou será com base nas dias do mês
      // const initOfMonthBasedInCurrentDatePlusTwoMonths = startOfMonth(
      //   addMonths(currentDate, 2),
      // );
      // return this.getFeesOfMonth(initOfMonthBasedInCurrentDatePlusTwoMonths);
      return 10 / 100; // 10%
    }

    return this.getFeesOfMonth(currentDate);
  }

  private roundUp(value: number) {
    const intergerPart = Number.parseInt(String(value), 10);
    const floatPart = value - intergerPart;
    if (floatPart && floatPart < 0.5) {
      return Number(parseInt(String(value), 10) + 1);
    }

    return Math.round(value);
  }

  private formatInstallmentDetails({
    currentDate,
    requestedValue,
    numberOfInstallments,
    joinedTelemedicine,
    consultantCommission,
    monthOfPayment,
    hasGratification,
    paymentDay,
    administrationFeeValue = 0,
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
    const fees = this.getFeesByMonthOfPayment(currentDate, monthOfPayment);
    const getAditionalValueWhenTheRequestValueIsLowerThan1000 =
      this.getAditionalValueWhenTheRequestValueIsLowerThan1000(
        requestedValue,
        numberOfInstallments,
      );
    const installmentValueWithFees = installmentFactor * (fees + 1);
    const installmentAdministrationFeeValue =
      administrationFeeValue / numberOfInstallments;
    const gratificationFeeValue =
      (hasGratification ? this.getGratificationValue() : 0) /
      numberOfInstallments;
    const installmentFinalValue =
      this.getInstallmentWithAditionalValues(
        installmentValueWithFees,
        joinedTelemedicine,
      ) +
      consultantCommissionValueByInstallment +
      getAditionalValueWhenTheRequestValueIsLowerThan1000 +
      installmentAdministrationFeeValue +
      gratificationFeeValue;

    return {
      gratificationFeeValue: this.roundUp(gratificationFeeValue),
      admnistrationFeeValue: this.roundUp(installmentAdministrationFeeValue),
      reference: this.formatReferenceDate(currentDate),
      referenceDate: currentDate,
      dueDate: paymentDay ? setDate(currentDate, paymentDay) : currentDate,
      cardFees: this.roundUp(this.getCardFees(1)),
      telemedicineFees: this.roundUp(
        this.getTelemedicineFees(joinedTelemedicine, 1),
      ),
      bankProcessingFees: this.roundUp(this.getbankProcessingFees(1)),
      installmentFactor,
      consultantCommission,
      consultantCommissionValue: this.roundUp(
        consultantCommissionValueByInstallment,
      ),
      fees: this.roundUp(parseFloat((fees * 100).toFixed(2))),
      feesValue: this.roundUp(
        parseFloat((fees * installmentFactor).toFixed(2)),
      ),
      finalValue: this.roundUp(parseFloat(installmentFinalValue.toFixed(2))),
    };
  }

  private getGratificationValue(): number {
    return loanConfig.gratificationValue;
  }

  private getInstallmentsDetails({
    requestedValue,
    numberOfInstallments,
    joinedTelemedicine,
    consultantCommission,
    monthOfPayment,
    hasGratification,
    administrationFeeValue,
    paymentDay = 0,
  }: IFormatInstallmentParams): IInstallmentDetails[] {
    let currentDate = startOfDay(new Date());
    if (monthOfPayment === MonthOfPayment.NEXT_MONTH) {
      currentDate = addMonths(currentDate, 1);
    } else if (monthOfPayment === MonthOfPayment.LAST_MONTH) {
      currentDate = addMonths(currentDate, 2);
    }
    const firstInstallment = this.formatInstallmentDetails({
      currentDate,
      requestedValue,
      numberOfInstallments,
      joinedTelemedicine,
      consultantCommission,
      monthOfPayment,
      hasGratification,
      administrationFeeValue,
      paymentDay,
    });
    const installments: IInstallmentDetails[] = new Array(
      numberOfInstallments,
    ).fill(firstInstallment);
    return installments.map(installment => {
      const formatedInstallment: IInstallmentDetails = {
        ...installment,
        reference: this.formatReferenceDate(currentDate),
        referenceDate: currentDate,
        dueDate: setDate(currentDate, paymentDay),
      };
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
      requestedValue,
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
    monthOfPayment,
    hasGratification,
    administrationFeeValue,
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
      monthOfPayment,
      hasGratification,
      administrationFeeValue,
      paymentDay: getDate(salaryReceiptDate || new Date()),
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
