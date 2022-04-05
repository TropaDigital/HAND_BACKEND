import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { createServer, Server } from 'http';

import { LoggerFactory } from './factories/LoggerFactory';
import MySqlDBClient from './infra/mySql';
import { ILogger } from './interfaces/logger/Logger';
import { errorMiddleware, loggerMiddleware } from './middlewares';
import { healthcheckRouter } from './modules';

export default class App {
  private application: Application;

  private server: Server;

  constructor(private readonly logger: ILogger = LoggerFactory.create()) {
    this.application = express();
    this.server = createServer(this.application);
  }

  private setupSwagger(): void {
    const { NODE_ENV } = process.env;
    if (!(NODE_ENV === 'development')) {
      this.logger.info({ msg: 'skiping setup of swagger docs' });
    }
  }

  private setupSwaggerStats(): void {
    this.logger.info({ msg: 'setuping swagger stats' });
  }

  private setupGlobalErrorMiddlewares(): void {
    this.logger.info({ msg: 'setuping global error middlewares' });
    this.application.use(errorMiddleware.notFoundMiddleware);
    this.application.use(errorMiddleware.handleErrorMiddleware);
    this.application.use(errorMiddleware.sendErrorMiddleware);
  }

  private setupGlobalMiddlewares(): void {
    this.logger.info({ msg: 'setuping global middlewares' });
    this.application.use(cors());
    this.application.use(loggerMiddleware);
    this.application.use(express.json());
    this.application.use(express.urlencoded({ extended: false }));
  }

  private setupSecurityMiddlewares(): void {
    this.logger.info({ msg: 'setuping security middlewares' });
    this.application.use(helmet());
  }

  private async setupRoutes(): Promise<void> {
    this.logger.info({ msg: 'setuping application routes' });
    [healthcheckRouter].forEach(router => router.setupRoutes(this.application));
  }

  private async setupDatabases(): Promise<void> {
    this.logger.info({ msg: 'connecting to databases' });
    await Promise.all([MySqlDBClient.getInstance().startConnection()]);
  }

  private async closeDatabasesConnection(): Promise<void> {
    this.logger.info({ msg: 'closing database connections' });
    await Promise.all([MySqlDBClient.getInstance().closeConnection()]);
  }

  public async stopApplication(): Promise<void> {
    this.logger.info({ msg: 'stop application' });
    await this.closeDatabasesConnection();
    this.logger.info({ msg: 'closing server' });
    this.server.close();
  }

  public initServer(): void {
    this.logger.info({ msg: 'initilializing server' });
    const { PORT, NODE_ENV } = process.env;
    this.server.listen(PORT, () => {
      this.logger.info({
        msg: `server listening on port ${PORT} in ${NODE_ENV} environment`,
      });
    });
  }

  public getServerInstance(): Server {
    return this.server;
  }

  public getInstance(): Application {
    return this.application;
  }

  public async initApplictation(): Promise<void> {
    this.logger.info({ msg: 'initializing application' });
    await this.setupDatabases();
    this.setupSwagger();
    this.setupSwaggerStats();
    this.setupGlobalMiddlewares();
    this.setupSecurityMiddlewares();
    await this.setupRoutes();
    this.setupGlobalErrorMiddlewares();
  }
}
