import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import { createConsultantController } from './factories';
import { IConsultantController } from './interfaces';

export default class ConsultantRouter implements IRouter {
  private static instance: ConsultantRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: IConsultantController) {}

  public static getInstance(
    controller: IConsultantController = createConsultantController(),
  ): ConsultantRouter {
    if (!this.instance) {
      this.instance = new ConsultantRouter(controller);
    }

    return this.instance;
  }

  private getAllConsultants(): void {
    /**
     *
     */
    this.router
      .route('/consultants')
      .get(
        ExpressRouteAdapter.adapt<IConsultantController>(
          this.controller,
          'getAllConsultants',
        ),
      );
  }

  private getConsultantById(): void {
    /**
     *
     */
    this.router
      .route('/consultants/:id')
      .get(
        ExpressRouteAdapter.adapt<IConsultantController>(
          this.controller,
          'getConsultantById',
        ),
      );
  }

  private createConsultant(): void {
    /**
     *
     */
    this.router
      .route('/consultants')
      .post(
        ExpressRouteAdapter.adapt<IConsultantController>(
          this.controller,
          'createConsultant',
        ),
      );
  }

  private updateConsultant(): void {
    /**
     *
     */
    this.router
      .route('/consultants/:id')
      .patch(
        ExpressRouteAdapter.adapt<IConsultantController>(
          this.controller,
          'updateConsultant',
        ),
      );
  }

  private deleteConsultant(): void {
    /**
     *
     */
    this.router
      .route('/consultants/:id')
      .delete(
        ExpressRouteAdapter.adapt<IConsultantController>(
          this.controller,
          'deleteConsultant',
        ),
      );
  }

  setupRoutes(app: Application): void {
    this.getAllConsultants();
    this.getConsultantById();
    this.createConsultant();
    this.updateConsultant();
    this.deleteConsultant();

    app.use(this.router);
  }
}
