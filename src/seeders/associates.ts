/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Prisma, PrismaClient } from '@prisma/client';

import { LoggerFactory } from '../factories/LoggerFactory';

const associateds: Prisma.AssociatedCreateInput[] = [
  {
    name: 'Márcio',
    lastName: 'Das Neves',
    affiliation: 'ASES COLATINA',
    gender: 'Masculino',
    birthDate: new Date('1991-06-06'),
    maritalStatus: 'Casado',
    nationality: 'Brasileiro',
    placeOfBirth: 'Poti',
    taxId: '884.747.923-12',
    registerId: '21.860.204-2',
    emissionState: 'Ceará',
    issuingAgency: 'Secretaria de Segurança Pública',
    emissionDate: new Date('2022-10-10'),
    cellPhone: '(88) 3768-4973',
    email: 'marcio.davi.dasneves@likaleal.com.br',
    father: 'Vicente Alexandre das Neves',
    mother: 'Allana Rafaela',
    partner: 'Joana Maria das Neves',

    employmentRelationships: {
      create: {
        occupation: 'Dentista',
        publicAgency: 'MiSupremo Tribunal Federal',
        paymentDay: 5,
        contractType: 'HIRED',
        registerNumber: '2108602049',
        salary: '3000.20',
      },
    },

    addresses: {
      create: {
        addressType: 'HOUSE',
        postalCode: '63720-976',
        street: 'Rua Poti',
        houseNumber: '123',
        complement: '',
        district: 'Jardim Poti',
        state: 'Ceara',
        city: 'Poti',
      },
    },
    bankAccounts: {
      create: {
        bank: 'Itaú',
        agency: '000',
        accountType: 'Corrente',
        accountNumber: '23132',
        pixKey: 'marcos@mail.com',
      },
    },
    createdBy: 'João',
  },
  {
    name: 'Eloá',
    lastName: 'Rodrigues',
    affiliation: 'ASES COLATINA',
    gender: 'Feminino',
    birthDate: new Date('1993-05-25'),
    maritalStatus: 'Casado',
    nationality: 'Brasileiro',
    placeOfBirth: 'Apiacás',
    taxId: '204.151.743-33',
    registerId: '25.734.569-3',
    emissionState: 'Mato Grosso',
    issuingAgency: 'Secretaria de Segurança Pública',
    emissionDate: new Date('2022-10-10'),
    cellPhone: '(88) 99211-8683',
    email: 'eloa_freitas@superigi.com.br',
    father: 'Tomás Caio Thomas Freitas',
    mother: 'Milena Louise',
    partner: 'Joana Maria das Neves',

    employmentRelationships: {
      create: {
        occupation: 'Advogado',
        publicAgency: 'MiSupremo Tribunal Federal',
        paymentDay: 5,
        contractType: 'HIRED',
        registerNumber: '2108602049',
        salary: '8654,45',
      },
    },

    addresses: {
      create: {
        addressType: 'HOUSE',
        postalCode: '78595-970',
        street: 'Avenida Governador Dante Martins de Oliveira 115',
        houseNumber: '123',
        complement: '',
        district: 'Centro',
        state: 'Mato Grosso',
        city: 'Apiacás',
      },
    },

    bankAccounts: {
      create: {
        bank: 'Itaú',
        agency: '000',
        accountType: 'Corrente',
        accountNumber: '23132',
        pixKey: 'eloa_freitas@superigi.com.br',
      },
    },
    benefits: {},
    createdBy: 'João',
  },
  {
    name: 'Jaqueline',
    lastName: 'Castro',
    affiliation: 'ASES COLATINA',
    gender: 'Feminino',
    birthDate: new Date('1993-05-25'),
    maritalStatus: 'Casado',
    nationality: 'Brasileiro',
    placeOfBirth: 'Apiacás',
    taxId: '204.151.743-30',
    registerId: '25.734.569-3',
    emissionState: 'Mato Grosso',
    issuingAgency: 'Secretaria de Segurança Pública',
    emissionDate: new Date('2022-10-10'),
    cellPhone: '(88) 99211-8683',
    email: 'eloa_freitas@superigi.com.br',
    father: 'Tomás Caio Thomas Freitas',
    mother: 'Milena Louise',
    partner: 'Joana Maria das Neves',

    employmentRelationships: {
      create: {
        occupation: 'Arquiteta',
        publicAgency: 'MiSupremo Tribunal Federal',
        paymentDay: 5,
        contractType: 'HIRED',
        registerNumber: '2108602049',
        salary: '3200,11',
      },
    },
    addresses: {
      create: {
        addressType: 'HOUSE',
        postalCode: '78595-970',
        street: 'Avenida Governador Dante Martins de Oliveira 115',
        houseNumber: '123',
        complement: '',
        district: 'Centro',
        state: 'Mato Grosso',
        city: 'Apiacás',
      },
    },

    bankAccounts: {
      create: {
        bank: 'Itaú',
        agency: '000',
        accountType: 'Corrente',
        accountNumber: '23132',
        pixKey: 'eloa_freitas@superigi.com.br',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Ana',
    lastName: 'Santos',
    affiliation: 'ASES COLATINA',
    gender: 'Feminino',
    birthDate: new Date('1993-05-25'),
    maritalStatus: 'Casado',
    nationality: 'Brasileiro',
    placeOfBirth: 'Apiacás',
    taxId: '204.151.743-32',
    registerId: '25.734.569-3',
    emissionState: 'Mato Grosso',
    issuingAgency: 'Secretaria de Segurança Pública',
    emissionDate: new Date('2022-10-10'),
    cellPhone: '(88) 99211-8683',
    email: 'eloa_freitas@superigi.com.br',
    father: 'Tomás Caio Thomas Freitas',
    mother: 'Milena Louise',
    partner: 'Joana Maria das Neves',

    employmentRelationships: {
      create: {
        occupation: 'Arquiteta',
        publicAgency: 'MiSupremo Tribunal Federal',
        paymentDay: 5,
        contractType: 'HIRED',
        registerNumber: '2108602049',
        salary: '4312.20',
      },
    },

    addresses: {
      create: {
        addressType: 'HOUSE',
        postalCode: '78595-970',
        street: 'Avenida Governador Dante Martins de Oliveira 115',
        houseNumber: '123',
        complement: '',
        district: 'Centro',
        state: 'Mato Grosso',
        city: 'Apiacás',
      },
    },

    bankAccounts: {
      create: {
        bank: 'Itaú',
        agency: '000',
        accountType: 'Corrente',
        accountNumber: '23132',
        pixKey: 'eloa_freitas@superigi.com.br',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Camila',
    lastName: 'Souza',
    affiliation: 'ASES COLATINA',
    gender: 'Feminino',
    birthDate: new Date('1993-05-25'),
    maritalStatus: 'Casado',
    nationality: 'Brasileiro',
    placeOfBirth: 'Apiacás',
    taxId: '204.151.743-37',
    registerId: '25.734.569-3',
    emissionState: 'Mato Grosso',
    issuingAgency: 'Secretaria de Segurança Pública',
    emissionDate: new Date('2022-10-10'),
    cellPhone: '(88) 99211-8683',
    email: 'eloa_freitas@superigi.com.br',
    father: 'Tomás Caio Thomas Freitas',
    mother: 'Milena Louise',
    partner: 'Joana Maria das Neves',

    employmentRelationships: {
      create: {
        occupation: 'Arquiteta',
        publicAgency: 'MiSupremo Tribunal Federal',
        paymentDay: 5,
        contractType: 'HIRED',
        registerNumber: '2108602049',
        salary: '4312.20',
      },
    },

    addresses: {
      create: {
        addressType: 'HOUSE',
        postalCode: '78595-970',
        street: 'Avenida Governador Dante Martins de Oliveira 115',
        houseNumber: '123',
        complement: '',
        district: 'Centro',
        state: 'Mato Grosso',
        city: 'Apiacás',
      },
    },

    bankAccounts: {
      create: {
        bank: 'Itaú',
        agency: '000',
        accountType: 'Corrente',
        accountNumber: '23132',
        pixKey: 'eloa_freitas@superigi.com.br',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Alice',
    lastName: 'Soares',
    affiliation: 'ASES COLATINA',
    gender: 'Feminino',
    birthDate: new Date('1993-05-25'),
    maritalStatus: 'Casado',
    nationality: 'Brasileiro',
    placeOfBirth: 'Apiacás',
    taxId: '204.151.743-39',
    registerId: '25.734.569-3',
    emissionState: 'Mato Grosso',
    issuingAgency: 'Secretaria de Segurança Pública',
    emissionDate: new Date('2022-10-10'),
    cellPhone: '(88) 99211-8683',
    email: 'eloa_freitas@superigi.com.br',
    father: 'Tomás Caio Thomas Freitas',
    mother: 'Milena Louise',
    partner: 'Joana Maria das Neves',

    employmentRelationships: {
      create: {
        occupation: 'Arquiteta',
        publicAgency: 'MiSupremo Tribunal Federal',
        paymentDay: 5,
        contractType: 'HIRED',
        registerNumber: '2108602049',
        salary: '4312.20',
      },
    },

    addresses: {
      create: {
        addressType: 'HOUSE',
        postalCode: '78595-970',
        street: 'Avenida Governador Dante Martins de Oliveira 115',
        houseNumber: '123',
        complement: '',
        district: 'Centro',
        state: 'Mato Grosso',
        city: 'Apiacás',
      },
    },

    bankAccounts: {
      create: {
        bank: 'Itaú',
        agency: '000',
        accountType: 'Corrente',
        accountNumber: '23132',
        pixKey: 'eloa_freitas@superigi.com.br',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Silvia',
    lastName: 'Costa',
    affiliation: 'ASES COLATINA',
    gender: 'Feminino',
    birthDate: new Date('1993-05-25'),
    maritalStatus: 'Casado',
    nationality: 'Brasileiro',
    placeOfBirth: 'Apiacás',
    taxId: '204.151.743-40',
    registerId: '25.734.569-3',
    emissionState: 'Mato Grosso',
    issuingAgency: 'Secretaria de Segurança Pública',
    emissionDate: new Date('2022-10-10'),
    cellPhone: '(88) 99211-8683',
    email: 'eloa_freitas@superigi.com.br',
    father: 'Tomás Caio Thomas Freitas',
    mother: 'Milena Louise',
    partner: 'Joana Maria das Neves',

    employmentRelationships: {
      create: {
        occupation: 'Arquiteta',
        publicAgency: 'MiSupremo Tribunal Federal',
        paymentDay: 5,
        contractType: 'HIRED',
        registerNumber: '2108602049',
        salary: '4312.20',
      },
    },

    addresses: {
      create: {
        addressType: 'HOUSE',
        postalCode: '78595-970',
        street: 'Avenida Governador Dante Martins de Oliveira 115',
        houseNumber: '123',
        complement: '',
        district: 'Centro',
        state: 'Mato Grosso',
        city: 'Apiacás',
      },
    },

    bankAccounts: {
      create: {
        bank: 'Itaú',
        agency: '000',
        accountType: 'Corrente',
        accountNumber: '23132',
        pixKey: 'eloa_freitas@superigi.com.br',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Amanda',
    lastName: 'Freitas',
    affiliation: 'ASES COLATINA',
    gender: 'Feminino',
    birthDate: new Date('1993-05-25'),
    maritalStatus: 'Casado',
    nationality: 'Brasileiro',
    placeOfBirth: 'Apiacás',
    taxId: '204.151.743-45',
    registerId: '25.734.569-3',
    emissionState: 'Mato Grosso',
    issuingAgency: 'Secretaria de Segurança Pública',
    emissionDate: new Date('2022-10-10'),
    cellPhone: '(88) 99211-8683',
    email: 'eloa_freitas@superigi.com.br',
    father: 'Tomás Caio Thomas Freitas',
    mother: 'Milena Louise',
    partner: 'Joana Maria das Neves',

    employmentRelationships: {
      create: {
        occupation: 'Arquiteta',
        publicAgency: 'MiSupremo Tribunal Federal',
        paymentDay: 5,
        contractType: 'HIRED',
        registerNumber: '2108602049',
        salary: '4312.20',
      },
    },

    addresses: {
      create: {
        addressType: 'HOUSE',
        postalCode: '78595-970',
        street: 'Avenida Governador Dante Martins de Oliveira 115',
        houseNumber: '123',
        complement: '',
        district: 'Centro',
        state: 'Mato Grosso',
        city: 'Apiacás',
      },
    },

    bankAccounts: {
      create: {
        bank: 'Itaú',
        agency: '000',
        accountType: 'Corrente',
        accountNumber: '23132',
        pixKey: 'eloa_freitas@superigi.com.br',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Maria',
    lastName: 'Silva',
    affiliation: 'ASES COLATINA',
    gender: 'Feminino',
    birthDate: new Date('1993-05-25'),
    maritalStatus: 'Casado',
    nationality: 'Brasileiro',
    placeOfBirth: 'Apiacás',
    taxId: '204.151.743-60',
    registerId: '25.734.569-3',
    emissionState: 'Mato Grosso',
    issuingAgency: 'Secretaria de Segurança Pública',
    emissionDate: new Date('2022-10-10'),
    cellPhone: '(88) 99211-8683',
    email: 'eloa_freitas@superigi.com.br',
    father: 'Tomás Caio Thomas Freitas',
    mother: 'Milena Louise',
    partner: 'Joana Maria das Neves',

    employmentRelationships: {
      create: {
        occupation: 'Arquiteta',
        publicAgency: 'MiSupremo Tribunal Federal',
        paymentDay: 5,
        contractType: 'HIRED',
        registerNumber: '2108602049',
        salary: '4312.20',
      },
    },

    addresses: {
      create: {
        addressType: 'HOUSE',
        postalCode: '78595-970',
        street: 'Avenida Governador Dante Martins de Oliveira 115',
        houseNumber: '123',
        complement: '',
        district: 'Centro',
        state: 'Mato Grosso',
        city: 'Apiacás',
      },
    },
    bankAccounts: {
      create: {
        bank: 'Itaú',
        agency: '000',
        accountType: 'Corrente',
        accountNumber: '23132',
        pixKey: 'eloa_freitas@superigi.com.br',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Joana',
    lastName: 'Ferreira',
    affiliation: 'ASES COLATINA',
    gender: 'Feminino',
    birthDate: new Date('1993-05-25'),
    maritalStatus: 'Casado',
    nationality: 'Brasileiro',
    placeOfBirth: 'Apiacás',
    taxId: '204.151.743-70',
    registerId: '25.734.569-3',
    emissionState: 'Mato Grosso',
    issuingAgency: 'Secretaria de Segurança Pública',
    emissionDate: new Date('2022-10-10'),
    cellPhone: '(88) 99211-8683',
    email: 'eloa_freitas@superigi.com.br',
    father: 'Tomás Caio Thomas Freitas',
    mother: 'Milena Louise',
    partner: 'Joana Maria das Neves',

    employmentRelationships: {
      create: {
        occupation: 'Arquiteta',
        publicAgency: 'MiSupremo Tribunal Federal',
        paymentDay: 5,
        contractType: 'HIRED',
        registerNumber: '2108602049',
        salary: '4312.20',
      },
    },

    addresses: {
      create: {
        addressType: 'HOUSE',
        postalCode: '78595-970',
        street: 'Avenida Governador Dante Martins de Oliveira 115',
        houseNumber: '123',
        complement: '',
        district: 'Centro',
        state: 'Mato Grosso',
        city: 'Apiacás',
      },
    },

    bankAccounts: {
      create: {
        bank: 'Itaú',
        agency: '000',
        accountType: 'Corrente',
        accountNumber: '23132',
        pixKey: 'eloa_freitas@superigi.com.br',
      },
    },

    createdBy: 'Ferreira',
  },
];

export default async (client: PrismaClient): Promise<void> => {
  const logger = LoggerFactory.create();

  try {
    logger.info({
      msg: `creating ${associateds.length} associateds in the database`,
    });
    for (const associated of associateds) {
      await client.associated.upsert({
        where: {
          taxId: associated.taxId,
        },
        create: {
          ...associated,
          benefits: {
            create: {
              association: 'ASES',
              bank: 'Any Bank',
              contractModel: 'Any model',
              financialAssistanceValue: 20,
              installmentNumber: 6,
              installmentValue: 20,
              publicAgency: 'Public Agency',
              initialDate: new Date('2022-10-10'),
              createdBy: 'User',
            },
          },
        },
        update: {
          ...associated,
        },
      });
    }
  } catch (error) {
    logger.error({
      msg: `error creating ${associateds.length} associateds in the database`,
      error,
    });
  }
};
