import { Prisma, PrismaClient } from '@prisma/client';

import { LoggerFactory } from '../factories/LoggerFactory';

const affiliations: Prisma.AffiliationCreateInput[] = [
  {
    name: 'ASES Vitória',
    corporateTaxId: '35.882.309/0001-37',
  },
  {
    name: 'ASES Cachoeiro',
    corporateTaxId: '35.882.309/0002-37',
  },
  {
    name: 'ASES Colatina',
    corporateTaxId: '35.882.309/0003-37',
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
