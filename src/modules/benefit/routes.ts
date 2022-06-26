import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { createBenefitController } from './factories';
import { IBenefitController } from './interfaces';

export default class BenefitRouter implements IRouter {
  private static instance: BenefitRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: IBenefitController) {}

  public static getInstance(
    controller: IBenefitController = createBenefitController(),
  ): BenefitRouter {
    if (!this.instance) {
      this.instance = new BenefitRouter(controller);
    }

    return this.instance;
  }

  private getAll(): void {
    /**
     * GET /benefits
     * @tag Benefits
     * @summary get all the benefits.
     * @description return a list of benefits.
     * @response 200 - an array with the all the benefits.
     * @responseContent { BenefitResponse[]} 200.application/json
     * @responseExample { BenefitResponse[]} 200.application/json.BenefitResponse
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/benefits')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IBenefitController>(
          this.controller,
          'getAll',
        ),
      );
  }

  private getById(): void {
    /**
     * GET /benefits/{id}
     * @tag Benefits
     * @summary get a benefit by id.
     * @description return a benefit object.
     * @pathParam {int32} id id of the benefit
     * @response 200 - an object of benefit.
     * @responseContent { BenefitResponse} 200.application/json
     * @responseExample { BenefitResponse} 200.application/json.BenefitResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { BenefitBadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent { BenefitNotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/benefits/:id')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IBenefitController>(
          this.controller,
          'getById',
        ),
      );
  }

  private create(): void {
    /**
     * POST /benefits
     * @tag Benefits
     * @summary create a new benefit.
     * @description return the created benefit object.
     * @bodyContent {CreateBenefitPayload} application/json
     * @bodyRequired
     * @response 201 - an object of benefit.
     * @responseContent {CreateBenefitResponse} 201.application/json
     * @responseExample {CreateBenefitResponse} 200.application/json.CreateBenefitResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { BenefitBadRequestResponse} 400.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/benefits')
      .post(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IBenefitController>(
          this.controller,
          'create',
        ),
      );
  }

  private updateById(): void {
    /**
     * PATCH /benefits
     * @tag Benefits
     * @summary update a benefit.
     * @description return no content when successfully update the resource.
     * @pathParam {int32} id id of the benefit
     * @bodyContent {UpdateBenefitPayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { BenefitBadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent { BenefitNotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/benefits/:id')
      .patch(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IBenefitController>(
          this.controller,
          'updateById',
        ),
      );
  }

  private deleteById(): void {
    /**
     * DELETE /benefits
     * @tag Benefits
     * @summary create a benefit.
     * @description return no content when successfully delete the resource.
     * @pathParam {int32} id id of the benefit
     * @bodyContent {UpdateBenefitPayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { BenefitBadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent { BenefitNotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/benefits/:id')
      .delete(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IBenefitController>(
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
