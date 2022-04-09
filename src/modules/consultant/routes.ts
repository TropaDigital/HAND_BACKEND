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

  private getAll(): void {
    /**
     *
     */
    this.router
      .route('/consultants')
      .get(
        ExpressRouteAdapter.adapt<IConsultantController>(
          this.controller,
          'getAll',
        ),
      );
  }

  private getById(): void {
    /**
     *
     */
    this.router
      .route('/consultants/:id')
      .get(
        ExpressRouteAdapter.adapt<IConsultantController>(
          this.controller,
          'getById',
        ),
      );
  }

  private create(): void {
    /**
     *
     */
    this.router
      .route('/consultants')
      .post(
        ExpressRouteAdapter.adapt<IConsultantController>(
          this.controller,
          'create',
        ),
      );
  }

  private updateById(): void {
    /**
     *
     */
    this.router
      .route('/consultants/:id')
      .patch(
        ExpressRouteAdapter.adapt<IConsultantController>(
          this.controller,
          'updateById',
        ),
      );
  }

  private deleteById(): void {
    /**
     *
     */
    this.router
      .route('/consultants/:id')
      .delete(
        ExpressRouteAdapter.adapt<IConsultantController>(
          this.controller,
          'deleteById',
        ),
      );
  }

  setupRoutes(app: Application): void {
    this.create();
    this.getAll();
    this.getById();
    this.updateById();
    this.deleteById();

    app.use(this.router);
  }
}
