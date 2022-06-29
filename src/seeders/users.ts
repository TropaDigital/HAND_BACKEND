/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { PrismaClient, Role, Status } from '@prisma/client';

import { authConfig } from '../config/auth';
import { LoggerFactory } from '../factories/LoggerFactory';
import { AuthenticationService } from '../shared/auth/auth';

const users = [
  {
    name: 'Bruno Afonso',
    email: 'brunohafonso@gmail.com',
    password: authConfig().DEFAULT_PASSWORD,
    role: Role.ADMIN,
    status: Status.ACTIVE,
    userName: 'afonsobr',
  },
  {
    name: 'Lucas Simão',
    email: 'lucasimao64@gmail.com',
    password: authConfig().DEFAULT_PASSWORD,
    role: Role.ADMIN,
    status: Status.ACTIVE,
    userName: 'simaolc',
  },
  {
    name: 'Marcelo Barbosa',
    email: 'contato@haand.com.br',
    password: authConfig().DEFAULT_PASSWORD,
    role: Role.ADMIN,
    status: Status.ACTIVE,
    userName: 'barbosama',
  },
];

export default async (client: PrismaClient): Promise<void> => {
  const logger = LoggerFactory.create();
  const authService = new AuthenticationService();
  try {
    logger.info({ msg: `creating ${users.length} users in the database` });
    for (const user of users) {
      await client.user.upsert({
        where: {
          userName: user.userName,
        },
        create: {
          ...user,
          password: await authService.hashPassword(user.password),
        },
        update: {
          ...user,
          password: await authService.hashPassword(user.password),
        },
      });
    }
  } catch (error) {
    logger.error({
      msg: `error creating ${users.length} in the database`,
      error,
    });
  }
};