import { Prisma, PrismaClient } from '@prisma/client';

import { LoggerFactory } from '../factories/LoggerFactory';

const affiliations: Prisma.AffiliationCreateInput[] = [
  {
    name: 'ASES Vitória',
    corporateTaxId: '123456',
    address: {
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
  },
  {
    name: 'ASES Cachoeiro',
    corporateTaxId: '21212133',
    address: {
      create: {
        addressType: 'HOUSE',
        postalCode: '999999-970',
        street: 'Rua José das Flores 115',
        houseNumber: '123',
        complement: '',
        district: 'Jardim União',
        state: 'São Paulo',
        city: 'Apiacás',
        isDefault: true,
      },
    },
  },
  {
    name: 'ASES Colatina',
    corporateTaxId: '60504080',
    address: {
      create: {
        addressType: 'HOUSE',
        postalCode: '999999-970',
        street: 'Rua Chagas 115',
        houseNumber: '123',
        complement: '',
        district: 'Jardim União',
        state: 'Espírito Santo',
        city: 'Colatina',
        isDefault: true,
      },
    },
  },
];

export default async (client: PrismaClient): Promise<void> => {
  const logger = LoggerFactory.create();

  try {
    logger.info({
      msg: `creating ${affiliations.length} affiliations in the database`,
    });
    await Promise.all(
      affiliations.map(affiliation => {
        return client.affiliation.upsert({
          where: {
            name: affiliation.name,
          },

          create: {
            ...affiliation,
          },
          update: {
            ...affiliation,
          },
        });
      }),
    );
  } catch (error) {
    logger.error({
      msg: `error creating ${affiliations.length} affiliations in the database`,
      error: {
        message: (error as Error).message,
        stack: (error as Error).stack,
      },
    });
  }
};
