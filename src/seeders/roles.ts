import { Prisma, PrismaClient } from '@prisma/client';

import { LoggerFactory } from '../factories/LoggerFactory';

const roles: Prisma.RoleCreateInput[] = [
  {
    name: 'admin',
    description: 'nível de acesso total',
  },
  {
    name: 'operational',
    description: 'nível de acesso limitado',
  },
];

export default async (client: PrismaClient): Promise<void> => {
  const logger = LoggerFactory.create();
  try {
    logger.info({ msg: `creating ${roles.length} roles in the database` });
    await Promise.all(
      roles.map((role, index) => {
        return client.role.upsert({
          where: {
            name: role.name,
          },
          create: {
            id: index + 1,
            ...role,
          },
          update: {
            id: index + 1,
            ...role,
          },
        });
      }),
    );
  } catch (error: any) {
    logger.error({
      msg: `error creating ${roles.length} roles in the database`,
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
};
