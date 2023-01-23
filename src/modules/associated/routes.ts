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
     * @security apiKey
     * @summary get all the associateds.
     * @description return a list of associateds.
     * @queryParam {string} [taxId] the tax id that will be used like filter
     * @queryParam {string} [name] the name that will be used like filter
     * @response 200 - an array with the all the associateds.
     * @responseContent {GetAllAssociatedsResponse} 200.application/json
     * @responseExample {GetAllAssociatedsResponse} 200.application/json.GetAllAssociatedsResponse
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
     * @security apiKey
     * @summary get a associated by id.
     * @description return a associated object.
     * @pathParam {int32} id id of the associated
     * @response 200 - an object of associated.
     * @responseContent {GetAssociatedByIdResponse} 200.application/json
     * @responseExample {GetAssociatedByIdResponse} 200.application/json.GetAssociatedByIdResponse
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
     * @security apiKey
     * @summary create a new associated.
     * @description return the created associated object.
     * @bodyContent {CreateAssociatedPayload} application/json
     * @bodyRequired
     * @response 201 - an object of associated.
     * @responseContent {CreateAssociatedResponse} 201.application/json
     * @responseExample {CreateAssociatedResponse} 201.application/json.CreateAssociatedResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @responseExample {CreateAssociatedBadRequestResponse} 400.application/json.CreateAssociatedBadRequestResponse
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

  private upsertBankAccountByAssociatedIdAndId(): void {
    /**
     * PATCH /associateds/{associatedId}/bank-accounts/{bankAccountId}
     * @tag Associateds
     * @security apiKey
     * @summary update an address of an associated.
     * @description return the created associated object.
     * @pathParam {int32} associatedId
     * @pathParam {int32} bankAccountId
     * @bodyContent {UpsertBankAccountByAssociatedIdAndIdPayload} application/json
     * @bodyRequired
     * @response 200 - an object of associated address.
     * @responseContent {UpsertBankAccountByAssociatedIdAndIdResponse} 200.application/json
     * @responseExample {UpsertBankAccountByAssociatedIdAndIdResponse} 200.application/json.UpsertBankAccountByAssociatedIdAndIdResponse
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
      .route('/associateds/:associatedId/bank-accounts/:id')
      .patch(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAssociatedController>(
          this.controller,
          'updateBankAccountByAssociatedIdAndId',
        ),
      );
  }

  private updateAddressByAssociatedIdAndId(): void {
    /**
     * PATCH /associateds/{associatedId}/addresses/{addressId}
     * @tag Associateds
     * @security apiKey
     * @summary update an address of an associated.
     * @description return the created associated object.
     * @pathParam {int32} associatedId
     * @pathParam {int32} addressId
     * @bodyContent {UpsertAddressByAssociatedIdAndIdPayload} application/json
     * @bodyRequired
     * @response 200 - an object of associated address.
     * @responseContent {UpsertAddressByAssociatedIdAndIdResponse} 200.application/json
     * @responseExample {UpsertAddressByAssociatedIdAndIdResponse} 200.application/json.UpsertAddressByAssociatedIdAndIdResponse
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
      .route('/associateds/:associatedId/addresses/:id')
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
     * PATCH /associateds/{associatedId}/employment-relationships/{employmentRelationshipId}
     * @tag Associateds
     * @security apiKey
     * @summary create a new associated.
     * @description return the created associated object.
     * @pathParam {int32} associatedId
     * @pathParam {int32} employmentRelationshipId
     * @bodyContent {UpsertEmploymentRelationshipByAssociatedIdAndIdPayload} application/json
     * @bodyRequired
     * @response 200 - an object of associated.
     * @responseContent {UpsertEmploymentRelationshipByAssociatedIdAndIdResponse} 200.application/json
     * @responseExample {UpsertEmploymentRelationshipByAssociatedIdAndIdResponse} 200.application/json.UpsertEmploymentRelationshipByAssociatedIdAndIdResponse
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
      .route('/associateds/:associatedId/employment-relationships/:id')
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
     * GET /associateds/{id}/addresses
     * @tag Associateds
     * @security apiKey
     * @summary get addresses from an associated.
     * @description return a list of addresses.
     * @pathParam {int32} id id of the addresses
     * @response 200 - a list of addresses.
     * @responseContent {GetAddressesByAssociatedIdResponse} 200.application/json
     * @responseExample {GetAddressesByAssociatedIdResponse} 200.application/json.GetAddressesByAssociatedIdResponse
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
      .route('/associateds/:id/addresses')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAssociatedController>(
          this.controller,
          'getAddressesByAssociatedId',
        ),
      );
  }

  private getBankAccountsByAssociatedId(): void {
    /**
     * GET /associateds/{id}/bank-accounts
     * @tag Associateds
     * @security apiKey
     * @summary get addresses from an associated.
     * @description return a list of addresses.
     * @pathParam {int32} id id of the addresses
     * @response 200 - a list of addresses.
     * @responseContent {GetBankAccountsByAssociatedIdResponse} 200.application/json
     * @responseExample {GetBankAccountsByAssociatedIdResponse} 200.application/json.GetBankAccountsByAssociatedIdResponse
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
      .route('/associateds/:id/bank-accounts')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAssociatedController>(
          this.controller,
          'getBankAccountsByAssociatedId',
        ),
      );
  }

  private getEmplomentRelationshipsByAssociatedId(): void {
    /**
     * GET /associateds/{id}/employment-relationships
     * @tag Associateds
     * @security apiKey
     * @summary create a new associated.
     * @description return the created associated object.
     * @pathParam {int32} id id of the associated
     * @response 200 - an object of associated.
     * @responseContent {GetEmploymentRelationshipsByAssociatedIdResponse} 200.application/json
     * @responseExample {GetEmploymentRelationshipsByAssociatedIdResponse} 200.application/json.GetEmploymentRelationshipsByAssociatedIdResponse
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
      .route('/associateds/:id/employment-relationships')
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
     * @security apiKey
     * @summary update a associated.
     * @description return no content when successfully update the resource.
     * @pathParam {int32} id id of the associated
     * @bodyContent {UpdateAssociatedByIdPayload} application/json
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
     * @security apiKey
     * @summary delete an associated.
     * @description return no content when successfully delete the resource.
     * @pathParam {int32} id id of the associated
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
    this.getBankAccountsByAssociatedId();
    this.upsertBankAccountByAssociatedIdAndId();

    app.use(this.router);
  }
}
