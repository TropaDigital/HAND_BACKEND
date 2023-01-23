/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Prisma, PrismaClient } from '@prisma/client';

import { LoggerFactory } from '../factories/LoggerFactory';

const associateds: Prisma.AssociatedCreateInput[] = [
  {
    name: 'Márcio',
    lastName: 'Das Neves',

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

    affiliations: {
      connect: {
        name: 'ASES Vitória',
      },
    },
    createdBy: 'João',
  },
  {
    name: 'Eloá',
    lastName: 'Rodrigues',

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

    affiliations: {
      connect: [
        {
          name: 'ASES Vitória',
        },
      ],
    },
    createdBy: 'João',
  },
  {
    name: 'Jaqueline',
    lastName: 'Castro',

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

    affiliations: {
      connect: {
        name: 'ASES Vitória',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Ana',
    lastName: 'Santos',

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

    affiliations: {
      connect: {
        name: 'ASES Vitória',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Camila',
    lastName: 'Souza',

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

    affiliations: {
      connect: {
        name: 'ASES Vitória',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Alice',
    lastName: 'Soares',

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

    affiliations: {
      connect: {
        name: 'ASES Vitória',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Silvia',
    lastName: 'Costa',

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

    affiliations: {
      connect: {
        name: 'ASES Vitória',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Amanda',
    lastName: 'Freitas',

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

    affiliations: {
      connect: {
        name: 'ASES Vitória',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Maria',
    lastName: 'Silva',

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

    affiliations: {
      connect: {
        name: 'ASES Vitória',
      },
    },

    createdBy: 'Ferreira',
  },
  {
    name: 'Joana',
    lastName: 'Ferreira',

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

    affiliations: {
      connect: {
        name: 'ASES Vitória',
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
          employmentRelationships: {
            create: {
              occupation: 'Arquiteta',
              publicAgency: 'MiSupremo Tribunal Federal',
              paymentDay: 5,
              contractType: 'HIRED',
              registerNumber: '2108602049',
              salary: '4312.20',
              isDefault: true,
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
              isDefault: true,
            },
          },

          bankAccounts: {
            create: {
              bank: 'Itaú',
              agency: '000',
              accountType: 'Corrente',
              accountNumber: '23132',
              pixKey: 'eloa_freitas@superigi.com.br',
              isDefault: true,
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
      error: {
        message: (error as Error).message,
        stack: (error as Error).stack,
      },
    });
  }
};
