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
     * GET /healthcheck
     * @tag Healthcheck
     * @summary get the status of the application considering the status of all the required resources.
     * @description return an object with the status of the resources.
     * @response 200 - an object with the status of the resources when all is healthly.
     * @responseContent {HealthcheckResponse} 200.application/json
     * @responseExample {HealthlyResponse} 200.application/json.HealthlyResponse
     * @response 500 - an object with the status when the application is not healthly.
     * @responseContent {HealthcheckResponse} 500.application/json
     * @responseExample {UnhealthlyResponse} 500.application/json.UnhealthlyResponse
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
