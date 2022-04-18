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
     * GET /consultants
     * @tag Consultants
     * @summary get all the consultants.
     * @description return a list of consultants.
     * @response 200 - an array with the all the consultants.
     * @responseContent {ConsultantResponse[]} 200.application/json
     * @responseExample {ConsultantResponse[]} 200.application/json.ConsultantResponse
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
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
     * GET /consultants/{id}
     * @tag Consultants
     * @summary get a consultant by id.
     * @description return a consultant object.
     * @pathParam {int32} id id of the consultant
     * @response 200 - an object of consultant.
     * @responseContent {ConsultantResponse} 200.application/json
     * @responseExample {ConsultantResponse} 200.application/json.ConsultantResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent {NotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
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
     * POST /consultants
     * @tag Consultants
     * @summary create a new consultant.
     * @description return the created consultant object.
     * @bodyContent {CreateConsultantPayload} application/json
     * @bodyRequired
     * @response 201 - an object of consultant.
     * @responseContent {CreateConsultantResponse} 201.application/json
     * @responseExample {CreateConsultantResponse} 201.application/json.CreateConsultantResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {ConsultantBadRequestResponse} 400.application/json
     * @responseExample {ConsultantBadRequestResponse} 400.application/json.ConsultantBadRequestResponse
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
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
     * PATCH /consultants
     * @tag Consultants
     * @summary update a consultant.
     * @description return no content when successfully update the resource.
     * @pathParam {int32} id id of the consultant
     * @bodyContent {UpdateConsultantPayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent {NotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
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
     * DELETE /consultants
     * @tag Consultants
     * @summary delete a consultant.
     * @description return no content when successfully delete the resource.
     * @pathParam {int32} id id of the consultant
     * @bodyContent {ConsultantPayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent {NotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
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
