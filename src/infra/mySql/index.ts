import { LoggerFactory } from '../../factories/LoggerFactory';
import { IDatabaseConnection } from '../../interfaces/infra/IDatabaseConnection';
import { ILogger } from '../../interfaces/logger/ILogger';
import { prismaClientInstance } from './prismaClient';

export default class MySqlDBClient implements IDatabaseConnection {
  private static instance: MySqlDBClient;

  private constructor(
    private readonly loggerManager: ILogger,
    private prismaClient: typeof prismaClientInstance,
  ) {}

  public static getInstance(
    loggerManager?: ILogger,
    prismaClient?: typeof prismaClientInstance,
  ): MySqlDBClient {
    if (!MySqlDBClient.instance) {
      const prismaInstance = prismaClient || prismaClientInstance;
      const loggerInstance = loggerManager || LoggerFactory.create();
      MySqlDBClient.instance = new MySqlDBClient(
        loggerInstance,
        prismaInstance,
      );
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

  public getPrismaClientInstance(): typeof prismaClientInstance {
    return this.prismaClient;
  }
}
