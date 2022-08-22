import { ReferenceObject, SchemaObject } from 'openapi-comment-parser';

export default {
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
          updatedBy: {},
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
  AssociatedResponse: {
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
            items: {
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
                updatedBy: {},
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
        },
        required: ['totalResults', 'totalPages', 'currentPage', 'data'],
      },
    },
    required: ['statusCode', 'statusCodeAsString', 'data'],
  },
} as { [key: string]: SchemaObject | ReferenceObject };
