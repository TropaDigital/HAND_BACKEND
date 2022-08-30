import { Prisma, PrismaClient } from '@prisma/client';

import { LoggerFactory } from '../factories/LoggerFactory';

const affiliations: Prisma.AffiliationCreateInput[] = [
  {
    name: 'ASES Vitória',
  },
  {
    name: 'ASES Cachoeiro',
  },
  {
    name: 'ASES Colatina',
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
      error,
    });
  }
};
