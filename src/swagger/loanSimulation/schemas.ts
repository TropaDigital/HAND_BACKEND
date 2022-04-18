import { SchemaObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  GetLoanSimulationBasedOnRequestedResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
        description: 'http status code',
      },
      statusCodeAsString: {
        type: 'string',
        description: 'http status code as string',
      },
      data: {
        type: 'object',
        properties: {
          totalValue: {
            type: 'number',
            description: 'total value of the loan with fees',
          },
          salary: {
            type: 'number',
            description: 'salary used in the loan simulation',
          },
          feesValue: { type: 'number', description: 'total fees value' },
          cardFees: { type: 'number', description: 'total card fees value' },
          telemedicineFees: {
            type: 'number',
            description: 'total telemedicine fees value',
          },
          bankProcessingFees: {
            type: 'number',
            description: 'total bank processing fees value',
          },
          firstPaymentDates: {
            type: 'array',
            description:
              'the initial and final date of payment based on salary receipt date',
            items: {
              type: 'string',
              format: 'date-time',
              description: 'total fees value',
            },
          },
          maxInstallmentValueBySalary: {
            type: 'number',
            description: 'max installment value based on salary provided',
          },
          consultantCommission: {
            type: 'number',
            description: 'percentage of the consultant commission',
          },
          consultantCommissionValue: {
            type: 'number',
            description: 'consultant commission total value',
          },
          isRequestedValueValid: {
            type: 'boolean',
            description:
              'flag that indicates if the requested value is valid (if some of the installments value is not greater than 35% of the salary)',
          },
          installments: {
            type: 'array',
            description: 'installments details',
            items: { $ref: '#/components/schemas/InstallmentDetails' },
          },
        },
        required: [
          'totalValue',
          'salary',
          'feesValue',
          'cardFees',
          'telemedicineFees',
          'bankProcessingFees',
          'firstPaymentDates',
          'maxInstallmentValueBySalary',
          'consultantCommission',
          'consultantCommissionValue',
          'isRequestedValueValid',
          'installments',
        ],
        additionalProperties: false,
      },
    },
  },
  InstallmentDetails: {
    type: 'object',
    properties: {
      reference: { type: 'string', description: 'month and year of reference' },
      installmentFactor: {
        type: 'number',
        description: 'factor value of the installment',
      },
      consultantCommission: {
        type: 'number',
        description: 'percentage of consultant commission',
      },
      consultantCommissionValue: {
        type: 'number',
        description: 'value of the consultant commission',
      },
      cardFees: {
        type: 'number',
        description: 'value of card fees in current installment',
      },
      telemedicineFees: {
        type: 'number',
        description: 'value of telemedicine fees in current installment',
      },
      bankProcessingFees: {
        type: 'number',
        description: 'value of bank processing fees in current installment',
      },
      fees: {
        type: 'number',
        description: 'percentage of fees in the current installment',
      },
      feesValue: {
        type: 'number',
        description: 'value of fees in the current installment',
      },
      finalValue: {
        type: 'number',
        description: 'installment final value with all fees',
      },
    },
    required: [
      'reference',
      'installmentFactor',
      'consultantCommission',
      'consultantCommissionValue',
      'cardFees',
      'telemedicineFees',
      'bankProcessingFees',
      'fees',
      'feesValue',
      'finalValue',
    ],
    additionalProperties: false,
  },
  GetLoanSimulationBadRequestResponse: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        example: 'GENERIC_ERROR',
        description: 'internal code of the error',
      },
      statusCode: {
        example: 400,
        type: 'integer',
        description: 'http status code',
      },
      statusCodeAsString: {
        type: 'string',
        example: 'BAD_REQUEST',
        description: 'status code as string of the response',
      },
      description: { type: 'string', description: 'error description' },
      validationErrors: {
        type: 'array',
        items: { $ref: '#/components/schemas/ValidationError' },
      },
    },
    required: [
      'code',
      'statusCode',
      'statusCodeAsString',
      'description',
      'validationErrors',
    ],
    additionalProperties: false,
  },
  GetLoanSimulationBasedOnRequestedValuePayload: {
    type: 'object',
    properties: {
      salary: {
        type: 'number',
        example: 1500,
        description:
          'the salary that will be used to validate the requested loan value',
      },
      salaryReceiptDate: {
        type: 'string',
        format: 'date-time',
        example:
          'Sat Apr 30 2022 00:00:00 GMT-0300 (Horário Padrão de Brasília)',
        description: 'the date that the customer receives the salary',
      },
      requestedValue: {
        type: 'number',
        example: 1000,
        description: 'the date the person receives the salary',
      },
      numberOfInstallments: {
        type: 'number',
        example: 8,
        description: 'the number os installments',
      },
      joinedTelemedicine: {
        type: 'boolean',
        description: 'flag that indicates if the customer joined telemedicine',
      },
      consultantId: {
        type: 'number',
        example: 1,
        description: 'flag that indicates if the customer joined telemedicine',
      },
    },
    required: [
      'salary',
      'salaryReceiptDate',
      'requestedValue',
      'numberOfInstallments',
      'joinedTelemedicine',
    ],
    additionalProperties: false,
  },
} as { [key: string]: SchemaObject | ReferenceObject };
