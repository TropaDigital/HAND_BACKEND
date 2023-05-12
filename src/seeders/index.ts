import { prismaClientInstance } from '../infra/mySql/prismaClient';
import affiliationsSeeders from './affiliations';
import associatesSeeders from './associates';
import rolesSeeders from './roles';
import usersSeeders from './users';

export const executeSeeders = async (): Promise<void> => {
  const prismaClient = prismaClientInstance;
  await affiliationsSeeders(prismaClient);
  await rolesSeeders(prismaClient);
  await usersSeeders(prismaClient);
  await associatesSeeders(prismaClient);
};
