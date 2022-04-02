import { PrismaClient } from '@prisma/client';

import AbstractDatabaseConnection from '../../abstracts/AbstractDatabaseConnection';
import { LoggerFactory } from '../../factories/LoggerFactory';
import { Logger } from '../../interfaces/logger/Logger';

export default class MySqlDBClient extends AbstractDatabaseConnection {
  private static instance: MySqlDBClient;

  private constructor(
    private readonly loggerManager: Logger,
    private prismaClient: PrismaClient,
  ) {
    super();
  }

  public static getInstance(
    loggerManager: Logger = LoggerFactory.create(),
    prismaClient: PrismaClient = new PrismaClient(),
  ): MySqlDBClient {
    if (!MySqlDBClient.instance) {
      MySqlDBClient.instance = new MySqlDBClient(loggerManager, prismaClient);
    }

    return MySqlDBClient.instance;
  }

  public async closeConnection(): Promise<void> {
    await this.prismaClient.$disconnect();
  }

  public async getConnectionStatus(): Promise<'connected' | 'disconnected'> {
    const status = (await this.prismaClient
      .$queryRaw`show status like 'Conn%';`)
      ? 'connected'
      : 'disconnected';
    return status;
  }

  public async startConnection(): Promise<void> {
    try {
      if ((await this.getConnectionStatus()) === 'connected') return;
      await this.prismaClient.$connect();
    } catch (error) {
      this.loggerManager.error({
        msg: 'Unable to connect to the database: ',
        message: (error as Error).message,
        stack: (error as Error).stack,
      });

      throw error;
    }
  }

  public getPrismaClientInstance(): PrismaClient {
    return this.prismaClient;
  }
}
