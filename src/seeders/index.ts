import { PrismaClient } from '@prisma/client';

import associatesSeeders from './associates';
import usersSeeders from './users';

export const executeSeeders = async (): Promise<void> => {
  const prismaClient = new PrismaClient();
  await usersSeeders(prismaClient);
  await associatesSeeders(prismaClient);
};
