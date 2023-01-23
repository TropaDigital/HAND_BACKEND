import { BenefitType } from '@prisma/client';
import { ReferenceObject, SchemaObject } from 'openapi-comment-parser';

import { MonthOfPayment } from '../../enums/MonthOfPayment';

export default {
  GetInstallmentByReferenceDateResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      statusCodeAsString: {
        type: 'string',
        example: 'OK',
      },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            benefitId: {
              type: 'number',
            },
            reference: {
              type: 'string',
            },
            referenceDate: {
              type: 'string',
            },
            dueDate: {
              type: 'string',
            },
            installmentFactor: {
              type: 'number',
            },
            consultantCommission: {
              type: 'number',
            },
            consultantCommissionValue: {
              type: 'number',
            },
            cardFees: {
              type: 'number',
            },
            telemedicineFees: {
              type: 'number',
            },
            bankProcessingFees: {
              type: 'number',
            },
            fees: {
              type: 'number',
            },
            feesValue: {
              type: 'number',
            },
            finalValue: {
              type: 'number',
            },
            gratificationFeeValue: {
              type: 'number',
            },
            admnistrationFeeValue: {
              type: 'number',
            },
            status: {
              type: 'string',
            },
            createdBy: {
              type: 'string',
            },
            updatedBy: {},
            createdAt: {
              type: 'string',
            },
            updatedAt: {
              type: 'string',
            },
            benefit: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                },
                associatedId: {
                  type: 'number',
                },
                commission: {
                  type: 'number',
                },
                administrationFeeValue: {
                  type: 'number',
                },
                hasGratification: {
                  type: 'boolean',
                },
                joinedTelemedicine: {
                  type: 'boolean',
                },
                bank: {
                  type: 'string',
                },
                publicAgency: {
                  type: 'string',
                },
                contractModel: {
                  type: 'string',
                },
                installmentNumber: {
                  type: 'number',
                },
                initialDate: {
                  type: 'string',
                },
                financialAssistanceValue: {
                  type: 'number',
                },
                installmentValue: {
                  type: 'number',
                },
                name: {
                  type: 'string',
                },
                lastName: {
                  type: 'string',
                },
                gender: {
                  type: 'string',
                },
                birthDate: {
                  type: 'string',
                },
                maritalStatus: {
                  type: 'string',
                },
                nationality: {
                  type: 'string',
                },
                placeOfBirth: {
                  type: 'string',
                },
                taxId: {
                  type: 'string',
                },
                registerId: {
                  type: 'string',
                },
                emissionState: {
                  type: 'string',
                },
                issuingAgency: {
                  type: 'string',
                },
                emissionDate: {
                  type: 'string',
                },
                cellPhone: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                father: {
                  type: 'string',
                },
                mother: {
                  type: 'string',
                },
                partner: {
                  type: 'string',
                },
                occupation: {
                  type: 'string',
                },
                salary: {
                  type: 'string',
                },
                paymentDay: {
                  type: 'number',
                },
                registerNumber: {
                  type: 'string',
                },
                contractType: {
                  type: 'string',
                },
                finalDate: {},
                agency: {
                  type: 'string',
                },
                accountType: {
                  type: 'string',
                },
                accountNumber: {
                  type: 'string',
                },
                pixKey: {
                  type: 'string',
                },
                pixType: {},
                addressType: {
                  type: 'string',
                },
                postalCode: {
                  type: 'string',
                },
                street: {
                  type: 'string',
                },
                houseNumber: {
                  type: 'string',
                },
                complement: {
                  type: 'string',
                },
                district: {
                  type: 'string',
                },
                city: {
                  type: 'string',
                },
                state: {
                  type: 'string',
                },
                consultantId: {},
                type: {
                  type: 'string',
                },
                status: {
                  type: 'string',
                },
                affiliationId: {
                  type: 'number',
                },
                createdBy: {
                  type: 'string',
                },
                updatedBy: {},
                createdAt: {
                  type: 'string',
                },
                updatedAt: {
                  type: 'string',
                },
                deletedAt: {},
                associated: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'number',
                    },
                    name: {
                      type: 'string',
                    },
                    email: {
                      type: 'string',
                    },
                    lastName: {
                      type: 'string',
                    },
                    taxId: {
                      type: 'string',
                    },
                    registerId: {
                      type: 'string',
                    },
                    birthDate: {
                      type: 'string',
                    },
                    maritalStatus: {
                      type: 'string',
                    },
                    cellPhone: {
                      type: 'string',
                    },
                    nationality: {
                      type: 'string',
                    },
                    gender: {
                      type: 'string',
                    },
                    placeOfBirth: {
                      type: 'string',
                    },
                    employmentRelationships: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'number',
                          },
                          occupation: {
                            type: 'string',
                          },
                          contractType: {
                            type: 'string',
                          },
                          salary: {
                            type: 'string',
                          },
                          publicAgency: {
                            type: 'string',
                          },
                          isDefault: {
                            type: 'boolean',
                          },
                          finalDate: {},
                          registerNumber: {
                            type: 'string',
                          },
                          paymentDay: {
                            type: 'number',
                          },
                        },
                        required: [
                          'id',
                          'occupation',
                          'contractType',
                          'salary',
                          'publicAgency',
                          'isDefault',
                          'finalDate',
                          'registerNumber',
                          'paymentDay',
                        ],
                      },
                    },
                    affiliations: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'number',
                          },
                          name: {
                            type: 'string',
                          },
                        },
                        required: ['id', 'name'],
                      },
                    },
                    addresses: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'number',
                          },
                          street: {
                            type: 'string',
                          },
                          addressType: {
                            type: 'string',
                          },
                          city: {
                            type: 'string',
                          },
                          state: {
                            type: 'string',
                          },
                          district: {
                            type: 'string',
                          },
                          houseNumber: {
                            type: 'string',
                          },
                          isDefault: {
                            type: 'boolean',
                          },
                          complement: {
                            type: 'string',
                          },
                          postalCode: {
                            type: 'string',
                          },
                        },
                        required: [
                          'id',
                          'street',
                          'addressType',
                          'city',
                          'state',
                          'district',
                          'houseNumber',
                          'isDefault',
                          'complement',
                          'postalCode',
                        ],
                      },
                    },
                    bankAccounts: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'number',
                          },
                          accountNumber: {
                            type: 'string',
                          },
                          accountType: {
                            type: 'string',
                          },
                          agency: {
                            type: 'string',
                          },
                          bank: {
                            type: 'string',
                          },
                          isDefault: {
                            type: 'boolean',
                          },
                          pixKey: {
                            type: 'string',
                          },
                          pixType: {},
                        },
                        required: [
                          'id',
                          'accountNumber',
                          'accountType',
                          'agency',
                          'bank',
                          'isDefault',
                          'pixKey',
                          'pixType',
                        ],
                      },
                    },
                  },
                  required: [
                    'id',
                    'name',
                    'email',
                    'lastName',
                    'taxId',
                    'registerId',
                    'birthDate',
                    'maritalStatus',
                    'cellPhone',
                    'nationality',
                    'gender',
                    'placeOfBirth',
                    'employmentRelationships',
                    'affiliations',
                    'addresses',
                    'bankAccounts',
                  ],
                },
                consultant: {},
                affiliation: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'number',
                    },
                    name: {
                      type: 'string',
                    },
                  },
                  required: ['id', 'name'],
                },
              },
              required: [
                'id',
                'associatedId',
                'commission',
                'administrationFeeValue',
                'hasGratification',
                'joinedTelemedicine',
                'bank',
                'publicAgency',
                'contractModel',
                'installmentNumber',
                'initialDate',
                'financialAssistanceValue',
                'installmentValue',
                'name',
                'lastName',
                'gender',
                'birthDate',
                'maritalStatus',
                'nationality',
                'placeOfBirth',
                'taxId',
                'registerId',
                'emissionState',
                'issuingAgency',
                'emissionDate',
                'cellPhone',
                'email',
                'father',
                'mother',
                'partner',
                'occupation',
                'salary',
                'paymentDay',
                'registerNumber',
                'contractType',
                'finalDate',
                'agency',
                'accountType',
                'accountNumber',
                'pixKey',
                'pixType',
                'addressType',
                'postalCode',
                'street',
                'houseNumber',
                'complement',
                'district',
                'city',
                'state',
                'consultantId',
                'type',
                'status',
                'affiliationId',
                'createdBy',
                'updatedBy',
                'createdAt',
                'updatedAt',
                'deletedAt',
                'associated',
                'consultant',
                'affiliation',
              ],
            },
          },
          required: [
            'id',
            'benefitId',
            'reference',
            'referenceDate',
            'dueDate',
            'installmentFactor',
            'consultantCommission',
            'consultantCommissionValue',
            'cardFees',
            'telemedicineFees',
            'bankProcessingFees',
            'fees',
            'feesValue',
            'finalValue',
            'gratificationFeeValue',
            'admnistrationFeeValue',
            'status',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt',
            'benefit',
          ],
        },
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
  UpdateInstallmentByBenefitIdAndInstallmentIdPayload: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['PAID', 'PENDING', 'CANCELED'],
      },
    },
  },
  GetSimulationOfPostponentResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
      },
      statusCodeAsString: {
        type: 'string',
      },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            benefitId: {
              type: 'number',
            },
            reference: {
              type: 'string',
            },
            referenceDate: {
              type: 'string',
            },
            installmentFactor: {
              type: 'number',
            },
            consultantCommission: {
              type: 'number',
            },
            consultantCommissionValue: {
              type: 'number',
            },
            cardFees: {
              type: 'number',
            },
            telemedicineFees: {
              type: 'number',
            },
            bankProcessingFees: {
              type: 'number',
            },
            fees: {
              type: 'number',
            },
            feesValue: {
              type: 'number',
            },
            finalValue: {
              type: 'number',
            },
            gratificationFeeValue: {
              type: 'number',
            },
            admnistrationFeeValue: {
              type: 'number',
            },
            createdBy: {
              type: 'string',
            },
            updatedBy: {},
            disabledBy: {},
            createdAt: {
              type: 'string',
            },
            updatedAt: {
              type: 'string',
            },
            disabledAt: {},
            deletedAt: {},
            associatedId: {},
          },
          required: [
            'id',
            'benefitId',
            'reference',
            'referenceDate',
            'installmentFactor',
            'consultantCommission',
            'consultantCommissionValue',
            'cardFees',
            'telemedicineFees',
            'bankProcessingFees',
            'fees',
            'feesValue',
            'finalValue',
            'gratificationFeeValue',
            'admnistrationFeeValue',
            'createdBy',
            'updatedBy',
            'disabledBy',
            'createdAt',
            'updatedAt',
            'disabledAt',
            'deletedAt',
            'associatedId',
          ],
        },
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
  CreateBenefitPayload: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        example: BenefitType.D,
        enum: Object.keys(BenefitType),
      },
      affiliationId: {
        type: 'number',
      },
      addressId: {
        type: 'number',
      },
      bankAccountId: {
        type: 'number',
      },
      employmentRelationshipId: {
        type: 'number',
      },
      associatedId: {
        type: 'number',
      },
      consultantId: {
        type: 'number',
      },
      joinedTelemedicine: {
        type: 'boolean',
      },
      salaryReceiptDate: {
        type: 'string',
        format: 'date',
      },
      numberOfInstallments: {
        type: 'number',
      },
      requestedValue: {
        type: 'number',
      },
      salary: {
        type: 'number',
      },
      monthOfPayment: {
        type: 'string',
        example: MonthOfPayment.CURRENT_MONTH,
        enum: Object.values(MonthOfPayment),
      },
      administrationFeeValue: {
        type: 'number',
      },
      hasGratification: {
        type: 'boolean',
      },
    },
  },
  Affiliation: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      name: {
        type: 'string',
      },
      createdAt: {
        type: 'string',
      },
      updatedAt: {
        type: 'string',
      },
      deletedAt: {
        type: 'string',
        format: 'nullable',
      },
    },
    required: ['id', 'name', 'createdAt', 'updatedAt', 'deletedAt'],
  },
  Associated: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      name: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      gender: {
        type: 'string',
      },
      birthDate: {
        type: 'string',
      },
      maritalStatus: {
        type: 'string',
      },
      nationality: {
        type: 'string',
      },
      placeOfBirth: {
        type: 'string',
      },
      taxId: {
        type: 'string',
      },
      registerId: {
        type: 'string',
      },
      emissionState: {
        type: 'string',
      },
      issuingAgency: {
        type: 'string',
      },
      emissionDate: {
        type: 'string',
      },
      cellPhone: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      father: {
        type: 'string',
      },
      mother: {
        type: 'string',
      },
      partner: {
        type: 'string',
      },
      createdBy: {
        type: 'string',
      },
      updatedBy: {},
      createdAt: {
        type: 'string',
      },
      updatedAt: {
        type: 'string',
      },
      deletedAt: {
        type: 'string',
        format: 'nullable',
      },
    },
    required: [
      'id',
      'name',
      'lastName',
      'gender',
      'birthDate',
      'maritalStatus',
      'nationality',
      'placeOfBirth',
      'taxId',
      'registerId',
      'emissionState',
      'issuingAgency',
      'emissionDate',
      'cellPhone',
      'email',
      'father',
      'mother',
      'partner',
      'createdBy',
      'updatedBy',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
  },
  Benefit: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      associatedId: {
        type: 'number',
      },
      commission: {
        type: 'number',
      },
      administrationFeeValue: {
        type: 'number',
      },
      hasGratification: {
        type: 'boolean',
      },
      joinedTelemedicine: {
        type: 'boolean',
      },
      bank: {
        type: 'string',
      },
      publicAgency: {
        type: 'string',
      },
      contractModel: {
        type: 'string',
      },
      installmentNumber: {
        type: 'number',
      },
      initialDate: {
        type: 'string',
      },
      financialAssistanceValue: {
        type: 'number',
      },
      installmentValue: {
        type: 'number',
      },
      name: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      gender: {
        type: 'string',
      },
      birthDate: {
        type: 'string',
      },
      maritalStatus: {
        type: 'string',
      },
      nationality: {
        type: 'string',
      },
      placeOfBirth: {
        type: 'string',
      },
      taxId: {
        type: 'string',
      },
      registerId: {
        type: 'string',
      },
      emissionState: {
        type: 'string',
      },
      issuingAgency: {
        type: 'string',
      },
      emissionDate: {
        type: 'string',
      },
      cellPhone: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      father: {
        type: 'string',
      },
      mother: {
        type: 'string',
      },
      partner: {
        type: 'string',
      },
      occupation: {
        type: 'string',
      },
      salary: {
        type: 'string',
      },
      paymentDay: {
        type: 'number',
      },
      registerNumber: {
        type: 'string',
      },
      contractType: {
        type: 'string',
      },
      finalDate: {
        type: 'string',
        format: 'datetime',
      },
      agency: {
        type: 'string',
      },
      accountType: {
        type: 'string',
      },
      accountNumber: {
        type: 'string',
      },
      pixKey: {
        type: 'string',
      },
      pixType: {
        type: 'string',
      },
      addressType: {
        type: 'string',
      },
      postalCode: {
        type: 'string',
      },
      street: {
        type: 'string',
      },
      houseNumber: {
        type: 'string',
      },
      complement: {
        type: 'string',
      },
      district: {
        type: 'string',
      },
      city: {
        type: 'string',
      },
      state: {
        type: 'string',
      },
      consultantId: {
        type: 'number',
      },
      type: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      affiliationId: {
        type: 'number',
      },
      createdBy: {
        type: 'string',
      },
      updatedBy: {
        type: 'string',
        format: 'nullable',
      },
      createdAt: {
        type: 'string',
        format: 'datetime',
      },
      updatedAt: {
        type: 'string',
        format: 'nullable',
      },
      deletedAt: {
        type: 'string',
        format: 'nullable',
      },
      affiliation: {
        $ref: '#/components/schemas/Affiliation',
      },
      associated: {
        $ref: '#/components/schemas/Associated',
      },
      consultant: {
        $ref: '#/components/schemas/Consultant',
        format: 'nullable',
      },
    },
    required: [
      'id',
      'associatedId',
      'commission',
      'administrationFeeValue',
      'hasGratification',
      'joinedTelemedicine',
      'bank',
      'publicAgency',
      'contractModel',
      'installmentNumber',
      'initialDate',
      'financialAssistanceValue',
      'installmentValue',
      'name',
      'lastName',
      'gender',
      'birthDate',
      'maritalStatus',
      'nationality',
      'placeOfBirth',
      'taxId',
      'registerId',
      'emissionState',
      'issuingAgency',
      'emissionDate',
      'cellPhone',
      'email',
      'father',
      'mother',
      'partner',
      'occupation',
      'salary',
      'paymentDay',
      'registerNumber',
      'contractType',
      'finalDate',
      'agency',
      'accountType',
      'accountNumber',
      'pixKey',
      'pixType',
      'addressType',
      'postalCode',
      'street',
      'houseNumber',
      'complement',
      'district',
      'city',
      'state',
      'consultantId',
      'type',
      'status',
      'affiliationId',
      'createdBy',
      'updatedBy',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'affiliation',
      'associated',
      'consultant',
    ],
  },
  GetAllBenefitsResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
      },
      statusCodeAsString: {
        type: 'string',
      },
      data: {
        type: 'object',
        properties: {
          totalResults: {
            type: 'number',
          },
          totalPages: {
            type: 'number',
          },
          currentPage: {
            type: 'number',
          },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Benefit' },
          },
        },
        required: ['totalResults', 'totalPages', 'currentPage', 'data'],
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
  GetBenefitByIdResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
      },
      statusCodeAsString: {
        type: 'string',
      },
      data: {
        $ref: '#/components/schemas/Benefit',
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
} as { [key: string]: SchemaObject | ReferenceObject };