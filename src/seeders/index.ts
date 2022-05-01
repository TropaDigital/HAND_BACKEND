import { PrismaClient } from '@prisma/client';

import usersSeeders from './users';

export const executeSeeders = async (): Promise<void> => {
  const prismaClient = new PrismaClient();
  await usersSeeders(prismaClient);
};
