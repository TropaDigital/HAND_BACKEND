export const loanConfig = {
  contract: 'Benefício',
  customer: 'Associado',
  company: 'Órgão Público',
  fees: 33,
  cardValue: 12,
  bankProcessingFee: 10,
  optionals: {
    telemedicineValue: 24,
  },
  maximumNumberOfInstallments: 8,
  factorTable: [1.1, 0.576, 0.402, 0.315, 0.264, 0.2295, 0.2055, 0.1875],
  aditionalValueWhenTheValueIsLowerThan1000: 112,
  gratificationValue: 30,
} as const;
