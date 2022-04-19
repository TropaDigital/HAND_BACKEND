import { startOfDay } from 'date-fns';

import { ILoanSimulationBasedOnRequestedValue } from '../../interfaces';

export const loanSimulationOfDay15OfTheMonthWithTelemedicine: ILoanSimulationBasedOnRequestedValue =
  {
    salary: 1500,
    maxInstallmentValueBySalary: 525,
    consultantCommission: 0,
    firstPaymentDates: [
      startOfDay(new Date('2022-04-30T03:00:00.000Z')),
      startOfDay(new Date('2022-05-30T03:00:00.000Z')),
      startOfDay(new Date('2022-06-14T03:00:00.000Z')),
    ],
    consultantCommissionValue: 0,
    isRequestedValueValid: true,
    feesValue: 74.24,
    cardFees: 96,
    bankProcessingFees: 80,
    totalValue: 1942.24,
    telemedicineFees: 192,
    installments: [
      {
        reference: 'abril/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 242.78,
      },
      {
        reference: 'maio/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 242.78,
      },
      {
        reference: 'junho/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 242.78,
      },
      {
        reference: 'julho/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 242.78,
      },
      {
        reference: 'agosto/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 242.78,
      },
      {
        reference: 'setembro/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 242.78,
      },
      {
        reference: 'outubro/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 242.78,
      },
      {
        reference: 'novembro/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 242.78,
      },
    ],
  };

export const loanSimulationOfDay15OfTheMonthWithoutTelemedicine: ILoanSimulationBasedOnRequestedValue =
  {
    salary: 1500,
    maxInstallmentValueBySalary: 525,
    consultantCommission: 0,
    firstPaymentDates: [
      startOfDay(new Date('2022-04-30T03:00:00.000Z')),
      startOfDay(new Date('2022-05-30T03:00:00.000Z')),
      startOfDay(new Date('2022-06-14T03:00:00.000Z')),
    ],
    consultantCommissionValue: 0,
    isRequestedValueValid: true,
    feesValue: 74.24,
    cardFees: 96,
    bankProcessingFees: 80,
    totalValue: 1750.24,
    telemedicineFees: 0,
    installments: [
      {
        reference: 'abril/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'maio/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'junho/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'julho/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'agosto/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'setembro/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'outubro/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'novembro/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
    ],
  };

export const loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDay: ILoanSimulationBasedOnRequestedValue =
  {
    salary: 1500,
    maxInstallmentValueBySalary: 525,
    consultantCommission: 0,
    firstPaymentDates: [],
    consultantCommissionValue: 0,
    isRequestedValueValid: true,
    feesValue: 74.24,
    cardFees: 96,
    bankProcessingFees: 80,
    totalValue: 1750.24,
    telemedicineFees: 0,
    installments: [
      {
        reference: 'abril/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'maio/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'junho/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'julho/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'agosto/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'setembro/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'outubro/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
      {
        reference: 'novembro/2022',
        cardFees: 12,
        telemedicineFees: 0,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.95,
        feesValue: 9.28,
        finalValue: 218.78,
      },
    ],
  };

export const loanSimulationOfDay16OfTheMonth: ILoanSimulationBasedOnRequestedValue =
  {
    salary: 1500,
    maxInstallmentValueBySalary: 525,
    consultantCommission: 0,
    firstPaymentDates: [
      startOfDay(new Date('2022-05-15T03:00:00.000Z')),
      startOfDay(new Date('2022-06-15T03:00:00.000Z')),
      startOfDay(new Date('2022-06-15T03:00:00.000Z')),
    ],
    consultantCommissionValue: 0,
    isRequestedValueValid: true,
    feesValue: 69.27999999999999,
    cardFees: 96,
    bankProcessingFees: 80,
    totalValue: 1937.2800000000002,
    telemedicineFees: 192,
    installments: [
      {
        reference: 'abril/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 242.16,
      },
      {
        reference: 'maio/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 242.16,
      },
      {
        reference: 'junho/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 242.16,
      },
      {
        reference: 'julho/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 242.16,
      },
      {
        reference: 'agosto/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 242.16,
      },
      {
        reference: 'setembro/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 242.16,
      },
      {
        reference: 'outubro/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 242.16,
      },
      {
        reference: 'novembro/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 0,
        consultantCommissionValue: 0,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 242.16,
      },
    ],
  };

export const loanSimulationOfDay15OfTheMonthWithTenPercentOfCommission: ILoanSimulationBasedOnRequestedValue =
  {
    salary: 1500,
    maxInstallmentValueBySalary: 525,
    consultantCommission: 10,
    firstPaymentDates: [
      startOfDay(new Date('2022-04-30T03:00:00.000Z')),
      startOfDay(new Date('2022-05-30T03:00:00.000Z')),
      startOfDay(new Date('2022-06-15T03:00:00.000Z')),
    ],
    consultantCommissionValue: 100,
    isRequestedValueValid: true,
    feesValue: 69.27999999999999,
    cardFees: 96,
    bankProcessingFees: 80,
    totalValue: 2037.2800000000002,
    telemedicineFees: 192,
    installments: [
      {
        reference: 'abril/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 10,
        consultantCommissionValue: 12.5,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 254.66,
      },
      {
        reference: 'maio/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 10,
        consultantCommissionValue: 12.5,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 254.66,
      },
      {
        reference: 'junho/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 10,
        consultantCommissionValue: 12.5,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 254.66,
      },
      {
        reference: 'julho/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 10,
        consultantCommissionValue: 12.5,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 254.66,
      },
      {
        reference: 'agosto/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 10,
        consultantCommissionValue: 12.5,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 254.66,
      },
      {
        reference: 'setembro/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 10,
        consultantCommissionValue: 12.5,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 254.66,
      },
      {
        reference: 'outubro/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 10,
        consultantCommissionValue: 12.5,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 254.66,
      },
      {
        reference: 'novembro/2022',
        cardFees: 12,
        telemedicineFees: 24,
        bankProcessingFees: 10,
        installmentFactor: 187.5,
        consultantCommission: 10,
        consultantCommissionValue: 12.5,
        fees: 4.62,
        feesValue: 8.66,
        finalValue: 254.66,
      },
    ],
  };
