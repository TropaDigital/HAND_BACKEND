/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Prisma, PrismaClient } from '@prisma/client';

import { LoggerFactory } from '../factories/LoggerFactory';

const benefits: Prisma.BenefitCreateInput[] = [
  {
    associated: {
      connect: {
        id: 1,
      },
    },
    association: 'ASES',
    bank: 'Any Bank',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
  {
    associated: {
      connect: {
        id: 2,
      },
    },
    association: 'ASES',
    bank: 'Any Bank',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
  {
    associated: {
      connect: {
        id: 3,
      },
    },
    association: 'ASES',
    bank: 'Any Bank',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
  {
    associated: {
      connect: {
        id: 3,
      },
    },
    association: 'ASES',
    bank: 'Any Bank',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
  {
    associated: {
      connect: {
        id: 4,
      },
    },
    association: 'ASES',
    bank: 'Any Bank',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
  {
    associated: {
      connect: {
        id: 5,
      },
    },
    association: 'ASES',
    bank: 'Any Bank',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
  {
    associated: {
      connect: {
        id: 6,
      },
    },
    association: 'ASES',
    bank: 'Any Bank',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
];

export default async (client: PrismaClient): Promise<void> => {
  const logger = LoggerFactory.create();

  try {
    logger.info({
      msg: `creating ${benefits.length} benefits in the database`,
    });
    if ((await client.benefit.count()) === 0)
      await client.benefit.createMany({ data: benefits });
  } catch (error) {
    logger.error({
      msg: `error creating ${benefits.length} in the database`,
      error,
    });
  }
};
