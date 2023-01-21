import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { createAffiliationController } from './factories';
import { IAffiliationController } from './interfaces';

export default class AffiliationRouter implements IRouter {
  private static instance: AffiliationRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: IAffiliationController) {}

  public static getInstance(
    controller: IAffiliationController = createAffiliationController(),
  ): AffiliationRouter {
    if (!this.instance) {
      this.instance = new AffiliationRouter(controller);
    }

    return this.instance;
  }

  private getAll(): void {
    /**
     * GET /affiliations
     * @tag Affiliations
     * @summary get all the affiliations.
     * @security apiKey
     * @description return a list of affiliations.
     * @response 200 - an array with the all the affiliations.
     * @responseContent {GetAllAffiliationsResponse} 200.application/json
     * @responseExample {GetAllAffiliationsResponse} 200.application/json.GetAllAffiliationsResponse
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/affiliations')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAffiliationController>(
          this.controller,
          'getAll',
        ),
      );
  }

  private getById(): void {
    /**
     * GET /affiliations/{id}
     * @tag Affiliations
     * @summary get a affiliation by id.
     * @security apiKey
     * @description return a affiliation object.
     * @pathParam {int32} id id of the affiliation
     * @response 200 - an object of affiliation.
     * @responseContent {GetAffiliationByIdResponse} 200.application/json
     * @responseExample {GetAffiliationByIdResponse} 200.application/json.GetAffiliationByIdResponse
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
      .route('/affiliations/:id')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAffiliationController>(
          this.controller,
          'getById',
        ),
      );
  }

  private create(): void {
    /**
     * POST /affiliations
     * @tag Affiliations
     * @summary create a new affiliation.
     * @security apiKey
     * @description return the created affiliation object.
     * @bodyContent {CreateAffiliationPayload} application/json
     * @bodyRequired
     * @response 201 - an object of affiliation.
     * @responseContent {CreateAffiliationResponse} 201.application/json
     * @responseExample {CreateAffiliationResponse} 201.application/json.CreateAffiliationResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 409 - an object with conflict error details.
     * @responseContent {ConflictResponse} 409.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/affiliations')
      .post(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAffiliationController>(
          this.controller,
          'create',
        ),
      );
  }

  private updateById(): void {
    /**
     * PATCH /affiliations/{id}
     * @tag Affiliations
     * @summary update a affiliation.
     * @security apiKey
     * @description return no content when successfully update the resource.
     * @pathParam {int32} id id of the affiliation
     * @bodyContent {UpdateAffiliationByIdPayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent {NotFoundResponse} 404.application/json
     * @response 409 - an object with conflict error details.
     * @responseContent {ConflictResponse} 409.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/affiliations/:id')
      .patch(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAffiliationController>(
          this.controller,
          'updateById',
        ),
      );
  }

  private deleteById(): void {
    /**
     * DELETE /affiliations/{id}
     * @tag Affiliations
     * @summary delete an affiliation.
     * @security apiKey
     * @description return no content when successfully delete the resource.
     * @pathParam {int32} id id of the affiliation
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent {NotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/affiliations/:id')
      .delete(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAffiliationController>(
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
