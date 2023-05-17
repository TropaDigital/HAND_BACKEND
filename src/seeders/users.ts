/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Prisma, PrismaClient, Status } from '@prisma/client';

import { authConfig } from '../config/auth';
import { LoggerFactory } from '../factories/LoggerFactory';
import { AuthenticationService } from '../shared/auth/auth';

const users: Prisma.UserCreateInput[] = [
  {
    name: 'Bruno Afonso',
    email: 'brunohafonso@gmail.com',
    password: authConfig().DEFAULT_PASSWORD,
    role: {
      connect: {
        name: 'admin',
      },
    },
    status: Status.ACTIVE,
    userName: 'afonsobr',
  },
  {
    name: 'Lucas Simão',
    email: 'lucasimao64@gmail.com',
    password: authConfig().DEFAULT_PASSWORD,
    role: {
      connect: {
        name: 'admin',
      },
    },
    status: Status.ACTIVE,
    userName: 'simaolc',
  },
  {
    name: 'Marcelo Barbosa',
    email: 'contato@haand.com.br',
    password: authConfig().DEFAULT_PASSWORD,
    role: {
      connect: {
        name: 'admin',
      },
    },
    status: Status.ACTIVE,
    userName: 'barbosama',
  },
  {
    name: 'Luciene Santos',
    email: 'contato2@haand.com.br',
    password: authConfig().DEFAULT_PASSWORD,
    role: {
      connect: {
        name: 'admin',
      },
    },
    status: Status.ACTIVE,
    userName: 'santoslu',
  },
  {
    name: 'Elayne Cavalcanti',
    email: 'contato3@haand.com.br',
    password: authConfig().DEFAULT_PASSWORD,
    role: {
      connect: {
        name: 'admin',
      },
    },
    status: Status.ACTIVE,
    userName: 'cavalcantiel',
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
      msg: `error creating ${users.length} users in the database`,
      error: {
        message: (error as Error).message,
        stack: (error as Error).stack,
      },
    });
  }
};
