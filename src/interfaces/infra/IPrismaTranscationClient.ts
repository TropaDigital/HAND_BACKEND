import { PrismaClient } from '@prisma/client';

export type IPrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;
