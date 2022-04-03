import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import { HealthcheckController } from './controller';
import { IHealthcheckController } from './interfaces';

export default class HealthCheckRouter implements IRouter {
  private static instance: HealthCheckRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: IHealthcheckController) {}

  public static getInstance(
    controller: IHealthcheckController = new HealthcheckController(),
  ): HealthCheckRouter {
    if (!this.instance) {
      this.instance = new HealthCheckRouter(controller);
    }

    return this.instance;
  }

  private checkApplicationStatus(): void {
    /**
     *
     */
    this.router
      .route('/healthcheck')
      .get(
        ExpressRouteAdapter.adapt<IHealthcheckController>(
          this.controller,
          'getApplicationStatus',
        ),
      );
  }

  setupRoutes(app: Application): void {
    this.checkApplicationStatus();
    app.use(this.router);
  }
}
