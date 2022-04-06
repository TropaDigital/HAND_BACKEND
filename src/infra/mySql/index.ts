import { PrismaClient } from '@prisma/client';

import { LoggerFactory } from '../../factories/LoggerFactory';
import { IDatabaseConnection } from '../../interfaces/infra/IDatabaseConnection';
import { ILogger } from '../../interfaces/logger/ILogger';

export default class MySqlDBClient implements IDatabaseConnection {
  private static instance: MySqlDBClient;

  private constructor(
    private readonly loggerManager: ILogger,
    private prismaClient: PrismaClient,
  ) {}

  public static getInstance(
    loggerManager: ILogger = LoggerFactory.create(),
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
