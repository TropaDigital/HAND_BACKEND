import { AssociatedStatus } from '@prisma/client';
import { ReferenceObject, SchemaObject } from 'openapi-comment-parser';

export default {
  UpdateAssociatedByIdPayload: {
    type: 'object',
    properties: {
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
        format: 'datetime',
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
      status: {
        type: 'string',
        enum: [...Object.keys(AssociatedStatus)],
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
        },
      },
    },
  },
  UpsertEmploymentRelationshipByAssociatedIdAndIdPayload: {
    type: 'object',
    properties: {
      isDefault: {
        type: 'boolean',
      },
      occupation: {
        type: 'string',
      },
      salary: {
        type: 'string',
      },
      paymentDay: {
        type: 'string',
      },
      registerNumber: {
        type: 'string',
      },
      contractType: {
        type: 'string',
      },
      finalDate: {
        type: 'string',
      },
      publicAgency: {
        type: 'string',
      },
    },
  },
  UpsertEmploymentRelationshipByAssociatedIdAndIdResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
      },
      statusCodeAsString: {
        type: 'string',
      },
      data: {
        $ref: '#/components/schemas/EmploymentRelationship',
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
  UpsertAddressByAssociatedIdAndIdPayload: {
    type: 'object',
    properties: {
      isDefault: {
        type: 'boolean',
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
    },
  },
  UpsertAddressByAssociatedIdAndIdResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
      },
      statusCodeAsString: {
        type: 'string',
      },
      data: {
        $ref: '#/components/schemas/Address',
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
  UpsertBankAccountByAssociatedIdAndIdPayload: {
    type: 'object',
    properties: {
      isDefault: {
        type: 'boolean',
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
      pixKey: {
        type: 'string',
      },
      pixType: {
        type: 'string',
      },
    },
  },
  UpsertBankAccountByAssociatedIdAndIdResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
      },
      statusCodeAsString: {
        type: 'string',
      },
      data: {
        $ref: '#/components/schemas/BankAccount',
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
  CreateAssociatedResponse: {
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
          id: {
            type: 'number',
          },
          name: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          },
          affiliation: {
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
          updatedBy: { type: 'string' },
          createdAt: {
            type: 'string',
          },
          updatedAt: {
            type: 'string',
          },
          deletedAt: {},
          addresses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
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
                associatedId: {
                  type: 'number',
                },
              },
              required: [
                'id',
                'addressType',
                'postalCode',
                'street',
                'houseNumber',
                'complement',
                'district',
                'city',
                'state',
                'associatedId',
              ],
            },
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
                },
                publicAgency: {
                  type: 'string',
                },
                associatedId: {
                  type: 'number',
                },
              },
              required: [
                'id',
                'occupation',
                'salary',
                'paymentDay',
                'registerNumber',
                'contractType',
                'finalDate',
                'publicAgency',
                'associatedId',
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
                bank: {
                  type: 'string',
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
                associatedId: {
                  type: 'number',
                },
              },
              required: [
                'id',
                'bank',
                'agency',
                'accountType',
                'accountNumber',
                'pixKey',
                'pixType',
                'associatedId',
              ],
            },
          },
        },
        required: [
          'id',
          'name',
          'lastName',
          'affiliation',
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
          'addresses',
          'employmentRelationships',
          'bankAccounts',
        ],
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
  CreateAssociatedPayload: {
    type: 'object',
    properties: {
      affiliation: {
        type: 'string',
      },
      birthDate: {
        type: 'string',
      },
      cellPhone: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      emissionDate: {
        type: 'string',
      },
      emissionState: {
        type: 'string',
      },
      status: {
        type: 'string',
        enum: [...Object.keys(AssociatedStatus)],
      },
      father: {
        type: 'string',
      },
      gender: {
        type: 'string',
      },
      issuingAgency: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      maritalStatus: {
        type: 'string',
      },
      mother: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      nationality: {
        type: 'string',
      },
      partner: {
        type: 'string',
      },
      placeOfBirth: {
        type: 'string',
      },
      registerId: {
        type: 'string',
      },
      taxId: {
        type: 'string',
      },
      bankAccounts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            agency: {
              type: 'string',
            },
            bank: {
              type: 'string',
            },
            pixKey: {
              type: 'string',
            },
            pixType: {
              type: 'string',
            },
            accountNumber: {
              type: 'string',
            },
            accountType: {
              type: 'string',
            },
          },
          required: [
            'agency',
            'bank',
            'pixKey',
            'pixType',
            'accountNumber',
            'accountType',
          ],
        },
      },
      employmentRelationships: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            contractType: {
              type: 'string',
            },
            finalDate: {
              type: 'string',
            },
            occupation: {
              type: 'string',
            },
            paymentDay: {
              type: 'string',
            },
            publicAgency: {
              type: 'string',
            },
            registerNumber: {
              type: 'string',
            },
            salary: {
              type: 'string',
            },
          },
          required: [
            'contractType',
            'finalDate',
            'occupation',
            'paymentDay',
            'publicAgency',
            'registerNumber',
            'salary',
          ],
        },
      },
      addresses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            addressType: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
            complement: {
              type: 'string',
            },
            district: {
              type: 'string',
            },
            houseNumber: {
              type: 'string',
            },
            postalCode: {
              type: 'string',
            },
            state: {
              type: 'string',
            },
            street: {
              type: 'string',
            },
          },
          required: [
            'addressType',
            'city',
            'complement',
            'district',
            'houseNumber',
            'postalCode',
            'state',
            'street',
          ],
        },
      },
    },
    required: [
      'affiliation',
      'birthDate',
      'cellPhone',
      'email',
      'emissionDate',
      'emissionState',
      'father',
      'gender',
      'issuingAgency',
      'lastName',
      'maritalStatus',
      'mother',
      'name',
      'nationality',
      'partner',
      'placeOfBirth',
      'registerId',
      'taxId',
      'bankAccounts',
      'employmentRelationships',
      'addresses',
    ],
  },
  GetAllAssociatedsResponse: {
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
            items: { $ref: '#/components/schemas/AssociatedPopulated' },
          },
        },
        required: ['totalResults', 'totalPages', 'currentPage', 'data'],
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
  GetAssociatedByIdResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
      },
      statusCodeAsString: {
        type: 'string',
      },
      data: {
        $ref: '#/components/schemas/AssociatedPopulated',
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
  EmploymentRelationship: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      isDefault: {
        type: 'boolean',
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
        format: 'date',
      },
      publicAgency: {
        type: 'string',
      },
      associatedId: {
        type: 'number',
      },
    },
    required: [
      'id',
      'isDefault',
      'occupation',
      'salary',
      'paymentDay',
      'registerNumber',
      'contractType',
      'finalDate',
      'publicAgency',
      'associatedId',
    ],
  },
  BenefitWithoutPopulated: {
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
      updatedBy: { type: 'string' },
      createdAt: {
        type: 'string',
      },
      updatedAt: {
        type: 'string',
      },
      deletedAt: {},
      affiliation: {
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
          deletedAt: {},
        },
        required: ['id', 'name', 'createdAt', 'updatedAt', 'deletedAt'],
      },
      consultant: {},
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
      'consultant',
    ],
  },
  AssociatedPopulated: {
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
      status: {
        type: 'string',
        enum: [...Object.keys(AssociatedStatus)],
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
      },
      addresses: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Address',
        },
      },
      employmentRelationships: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/EmploymentRelationship',
        },
      },
      bankAccounts: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/BankAccount',
        },
      },
      benefits: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/BenefitWithoutPopulated',
        },
      },
      affiliations: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Affiliation',
        },
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
      'addresses',
      'employmentRelationships',
      'bankAccounts',
      'benefits',
      'affiliations',
    ],
  },
  BankAccount: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      bank: {
        type: 'string',
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
      isDefault: {
        type: 'boolean',
      },
      associatedId: {
        type: 'number',
      },
    },
    required: [
      'id',
      'bank',
      'agency',
      'accountType',
      'accountNumber',
      'pixKey',
      'pixType',
      'isDefault',
      'associatedId',
    ],
  },
  Address: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      isDefault: {
        type: 'boolean',
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
      associatedId: {
        type: 'number',
      },
    },
    required: [
      'id',
      'isDefault',
      'addressType',
      'postalCode',
      'street',
      'houseNumber',
      'complement',
      'district',
      'city',
      'state',
      'associatedId',
    ],
  },
  GetAddressesByAssociatedIdResponse: {
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
        items: { $ref: '#/components/schemas/Address' },
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
  GetBankAccountsByAssociatedIdResponse: {
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
        items: { $ref: '#/components/schemas/BankAccount' },
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
  GetEmploymentRelationshipsByAssociatedIdResponse: {
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
        items: { $ref: '#/components/schemas/EmploymentRelationship' },
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
} as { [key: string]: SchemaObject | ReferenceObject };
