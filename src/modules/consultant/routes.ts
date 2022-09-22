import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { createConsultantController } from './factories';
import { IConsultantController } from './interfaces';

export default class ConsultantRouter implements IRouter {
  private static instance: ConsultantRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: IConsultantController) { }

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
     * @security apiKey
     * @summary get all the consultants.
     * @description return a list of consultants.
     * @response 200 - an array with the all the consultants.
     * @responseContent {GetAllConsultantsResponse} 200.application/json
     * @responseExample {GetAllConsultantsResponse} 200.application/json.GetAllConsultantsResponse
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/consultants')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
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
     * @security apiKey
     * @summary get a consultant by id.
     * @description return a consultant object.
     * @pathParam {int32} id id of the consultant
     * @response 200 - an object of consultant.
     * @responseContent {GetConsultantByIdResponse} 200.application/json
     * @responseExample {GetConsultantByIdResponse} 200.application/json.GetConsultantByIdResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent {NotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/consultants/:id')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
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
     * @security apiKey
     * @summary create a new consultant.
     * @description return the created consultant object.
     * @bodyContent {CreateConsultantPayload} application/json
     * @bodyRequired
     * @response 201 - an object of consultant.
     * @responseContent {CreateConsultantResponse} 201.application/json
     * @responseExample {CreateConsultantResponse} 201.application/json.CreateConsultantResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {ConsultantBadRequestResponse} 400.application/json
     * @responseExample {CreateConsultantBadRequestResponse} 400.application/json.CreateConsultantBadRequestResponse
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/consultants')
      .post(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IConsultantController>(
          this.controller,
          'create',
        ),
      );
  }

  private updateById(): void {
    /**
     * PATCH /consultants/{id}
     * @tag Consultants
     * @security apiKey
     * @summary update a consultant.
     * @description return no content when successfully update the resource.
     * @pathParam {int32} id id of the consultant
     * @bodyContent {UpdateConsultantPayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent {NotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/consultants/:id')
      .patch(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IConsultantController>(
          this.controller,
          'updateById',
        ),
      );
  }

  private deleteById(): void {
    /**
     * DELETE /consultants/{id}
     * @tag Consultants
     * @security apiKey
     * @summary delete a consultant.
     * @description return no content when successfully delete the resource.
     * @pathParam {int32} id id of the consultant
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent {NotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/consultants/:id')
      .delete(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
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
