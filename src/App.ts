import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { createServer, IncomingMessage, Server } from 'http';
import openapi from 'openapi-comment-parser';
import swaggerStats from 'swagger-stats';
import swaggerUI from 'swagger-ui-express';

import { LoggerFactory } from './factories/LoggerFactory';
import MySqlDBClient from './infra/mySql';
import { ILogger } from './interfaces/logger/ILogger';
import { errorMiddleware, loggerMiddleware } from './middlewares';
import {
  healthcheckRouter,
  loanSimulationRouter,
  consultantRouter,
} from './modules';
import openapiConfig from './openapirc';
import swaggerDefinition from './swagger';

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

    this.logger.info({ msg: 'setuping swagger docs' });
    const apiSchema = openapi(openapiConfig);
    this.application.use(
      '/docs',
      swaggerUI.serve,
      swaggerUI.setup({
        ...apiSchema,
        ...swaggerDefinition,
      }),
    );
  }

  private setupSwaggerStats(): void {
    this.logger.info({ msg: 'setuping swagger stats' });
    const apiSchema = openapi(openapiConfig);
    this.application.use(
      swaggerStats.getMiddleware({
        swaggerSpec: apiSchema,
        uriPath: '/monitoring',
        authentication: true,
        swaggerOnly: true,
        onAuthenticate(
          _req: IncomingMessage,
          username: string,
          password: string,
        ) {
          return (
            username === 'SWAGGER_STATS_USER' &&
            password === 'SWAGGER_STATS_PASSWORD'
          );
        },
      }),
    );
  }

  private setupGlobalErrorMiddlewares(): void {
    this.logger.info({ msg: 'setuping global error middlewares' });
    this.application.use(
      errorMiddleware.notFoundMiddleware.bind(errorMiddleware),
    );
    this.application.use(
      errorMiddleware.handleErrorMiddleware.bind(errorMiddleware),
    );
    this.application.use(
      errorMiddleware.sendErrorMiddleware.bind(errorMiddleware),
    );
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
    [healthcheckRouter, loanSimulationRouter, consultantRouter].forEach(
      router => router.setupRoutes(this.application),
    );
  }

  private async setupDatabases(): Promise<void> {
    this.logger.info({ msg: 'connecting to databases' });
    await Promise.all([MySqlDBClient.getInstance().startConnection()]);
  }

  private async closeDatabasesConnection(): Promise<void> {
    this.logger.info({ msg: 'closing database connections' });
    await Promise.all([MySqlDBClient.getInstance().closeConnection()]);
    this.logger.info({ msg: 'database connections closed successfully' });
  }

  public async stopApplication(): Promise<void> {
    this.logger.info({ msg: 'stop application' });
    await this.closeDatabasesConnection();
    this.logger.info({ msg: 'closing server' });
    await this.stopServer();
  }

  public stopServer(): Promise<void> {
    return new Promise(resolve => {
      this.server.close(error => {
        if (error) {
          this.logger.error({ msg: error.message });
          return resolve();
        }

        return resolve();
      });
    });
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

  public async initApplication(): Promise<void> {
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
