import { PrismaClient } from '@prisma/client';

import associatesSeeders from './associates';
import rolesSeeders from './roles';
import usersSeeders from './users';

export const executeSeeders = async (): Promise<void> => {
  const prismaClient = new PrismaClient();
  await rolesSeeders(prismaClient);
  await usersSeeders(prismaClient);
  await associatesSeeders(prismaClient);
};
