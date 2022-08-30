import { PrismaClient } from '@prisma/client';

import affiliationsSeeders from './affiliations';
import associatesSeeders from './associates';
import rolesSeeders from './roles';
import usersSeeders from './users';

export const executeSeeders = async (): Promise<void> => {
  const prismaClient = new PrismaClient();
  await affiliationsSeeders(prismaClient);
  await rolesSeeders(prismaClient);
  await usersSeeders(prismaClient);
  await associatesSeeders(prismaClient);
};
