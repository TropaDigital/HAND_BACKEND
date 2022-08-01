import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { createAssociatedController } from './factories';
import { IAssociatedController } from './interfaces';

export default class AssociatedRouter implements IRouter {
  private static instance: AssociatedRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: IAssociatedController) {}

  public static getInstance(
    controller: IAssociatedController = createAssociatedController(),
  ): AssociatedRouter {
    if (!this.instance) {
      this.instance = new AssociatedRouter(controller);
    }

    return this.instance;
  }

  private getAll(): void {
    /**
     * GET /associateds
     * @tag Associateds
     * @summary get all the associateds.
     * @description return a list of associateds.
     * @response 200 - an array with the all the associateds.
     * @responseContent {AssociatedResponse[]} 200.application/json
     * @responseExample {AssociatedResponse[]} 200.application/json.AssociatedResponse
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/associateds')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAssociatedController>(
          this.controller,
          'getAll',
        ),
      );
  }

  private getById(): void {
    /**
     * GET /associateds/{id}
     * @tag Associateds
     * @summary get a associated by id.
     * @description return a associated object.
     * @pathParam {int32} id id of the associated
     * @response 200 - an object of associated.
     * @responseContent {AssociatedResponse} 200.application/json
     * @responseExample {AssociatedResponse} 200.application/json.AssociatedResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {AssociatedBadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent {AssociatedNotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/associateds/:id')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAssociatedController>(
          this.controller,
          'getById',
        ),
      );
  }

  private create(): void {
    /**
     * POST /associateds
     * @tag Associateds
     * @summary create a new associated.
     * @description return the created associated object.
     * @bodyContent {CreateAssociatedPayload} application/json
     * @bodyRequired
     * @response 201 - an object of associated.
     * @responseContent {CreateAssociatedResponse} 201.application/json
     * @responseExample {CreateAssociatedResponse} 200.application/json.CreateAssociatedResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { AssociatedBadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/associateds')
      .post(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAssociatedController>(
          this.controller,
          'create',
        ),
      );
  }

  private updateAddressByAssociatedIdAndId(): void {
    /**
     * PATCH /associateds/addresses/{id}
     * @tag Associateds
     * @summary update an address of an associated.
     * @description return the created associated object.
     * @pathParam {int32} id id of the associated
     * @response 200 - an object of associated address.
     * @responseContent {CreateAssociatedResponse} 201.application/json
     * @responseExample {CreateAssociatedResponse} 200.application/json.CreateAssociatedResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { AssociatedBadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/associateds/addresses/:id')
      .patch(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAssociatedController>(
          this.controller,
          'updateAddressByAssociatedIdAndId',
        ),
      );
  }

  private updateEmploymentRelationshipsByAssociatedIdAndId(): void {
    /**
     * PATCH /associateds/employment-relationships/{id}
     * @tag Associateds
     * @summary create a new associated.
     * @description return the created associated object.
     * @pathParam {int32} id id of the associated
     * @response 200 - an object of associated.
     * @responseContent {CreateAssociatedResponse} 201.application/json
     * @responseExample {CreateAssociatedResponse} 200.application/json.CreateAssociatedResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { AssociatedBadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/associateds/employment-relationships/:id')
      .patch(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAssociatedController>(
          this.controller,
          'updateEmploymentRelationshipsByAssociatedIdAndId',
        ),
      );
  }

  private getAddressesByAssociatedId(): void {
    /**
     * GET /associateds/addresses/{id}
     * @tag Associateds
     * @summary get addresses from an associated.
     * @description return a list of addresses.
     * @pathParam {int32} id id of the addresses
     * @response 200 - a list of addresses.
     * @responseContent {CreateAssociatedResponse} 201.application/json
     * @responseExample {CreateAssociatedResponse} 200.application/json.CreateAssociatedResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { AssociatedBadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/associateds/addresses/:id')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAssociatedController>(
          this.controller,
          'getAddressesByAssociatedId',
        ),
      );
  }

  private getEmplomentRelationshipsByAssociatedId(): void {
    /**
     * GET /associateds/employment-relationships/{id}
     * @tag Associateds
     * @summary create a new associated.
     * @description return the created associated object.
     * @pathParam {int32} id id of the associated
     * @response 200 - an object of associated.
     * @responseContent {CreateAssociatedResponse} 201.application/json
     * @responseExample {CreateAssociatedResponse} 200.application/json.CreateAssociatedResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { AssociatedBadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/associateds/employment-relationships/:id')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAssociatedController>(
          this.controller,
          'getEmploymentRelationshipsByAssociatedId',
        ),
      );
  }

  private updateById(): void {
    /**
     * PATCH /associateds/{id}
     * @tag Associateds
     * @summary update a associated.
     * @description return no content when successfully update the resource.
     * @pathParam {int32} id id of the associated
     * @bodyContent {UpdateAssociatedPayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { AssociatedBadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent { AssociatedNotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/associateds/:id')
      .patch(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAssociatedController>(
          this.controller,
          'updateById',
        ),
      );
  }

  private deleteById(): void {
    /**
     * DELETE /associateds/{id}
     * @tag Associateds
     * @summary create a associated.
     * @description return no content when successfully delete the resource.
     * @pathParam {int32} id id of the associated
     * @bodyContent {UpdateAssociatedPayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { AssociatedBadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent { AssociatedNotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/associateds/:id')
      .delete(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAssociatedController>(
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
    this.getEmplomentRelationshipsByAssociatedId();
    this.updateEmploymentRelationshipsByAssociatedIdAndId();
    this.getAddressesByAssociatedId();
    this.updateAddressByAssociatedIdAndId();

    app.use(this.router);
  }
}
