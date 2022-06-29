/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Prisma, PrismaClient } from '@prisma/client';

import { LoggerFactory } from '../factories/LoggerFactory';

const benefits: Prisma.BenefitCreateInput[] = [
  {
    associated: 'Pedro',
    association: 'ASES',
    bank: 'Any Bank',
    consultant: 'Any Consultant',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
  {
    associated: 'Joao',
    association: 'ASES',
    bank: 'Any Bank',
    consultant: 'Any Consultant',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
  {
    associated: 'Maria',
    association: 'ASES',
    bank: 'Any Bank',
    consultant: 'Any Consultant',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
  {
    associated: 'André',
    association: 'ASES',
    bank: 'Any Bank',
    consultant: 'Any Consultant',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
  {
    associated: 'Marta',
    association: 'ASES',
    bank: 'Any Bank',
    consultant: 'Any Consultant',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
  {
    associated: 'Saulo',
    association: 'ASES',
    bank: 'Any Bank',
    consultant: 'Any Consultant',
    contractModel: 'Any model',
    financialAssistanceValue: 20,
    installmentNumber: 6,
    installmentValue: 20,
    publicAgency: 'Public Agency',
    initialDate: new Date('2022-10-10'),
    createdBy: 'User',
  },
  {
    associated: 'Mateus',
    association: 'ASES',
    bank: 'Any Bank',
    consultant: 'Any Consultant',
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
