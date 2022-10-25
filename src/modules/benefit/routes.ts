import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { createBenefitController } from './factories';
import { IBenefitController } from './interfaces';

export default class BenefitRouter implements IRouter {
  private static instance: BenefitRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: IBenefitController) { }

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
     * @security apiKey
     * @summary get all the benefits.
     * @description return a list of benefits
     * @queryParam {int32} [resultsPerPage]
     * @queryParam {int32} [page]
     * @queryParam {string} [association]
     * @queryParam {string} [bank]
     * @queryParam {string} [publicAgency]
     * @queryParam {string} [contractModel]
     * @queryParam {int32} [installmentNumber]
     * @queryParam {date} [initialDate]
     * @queryParam {int32} [financialAssistanceValue]
     * @queryParam {int32} [installmentValue]
     * @queryParam {string} [consultant]
     * @response 200 - an array with the all the benefits.
     * @responseContent {GetAllBenefitsResponse} 200.application/json
     * @responseExample {GetAllBenefitsResponse} 200.application/json.GetAllBenefitsResponse
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
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
     * @security apiKey
     * @summary get a benefit by id.
     * @description return a benefit object.
     * @pathParam {int32} id id of the benefit
     * @response 200 - an object of benefit.
     * @responseContent {GetBenefitByIdResponse} 200.application/json
     * @responseExample {GetBenefitByIdResponse} 200.application/json.GetBenefitByIdResponse
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
      .route('/benefits/:id')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IBenefitController>(
          this.controller,
          'getById',
        ),
      );
  }

  private adjustment(): void {
    /**
     * PUT /benefits/{benefitId}/adjustment
     * @tag Benefits
     * @summary adjusts benefit installments.
     * @security apiKey
     * @description adjusts benefit installments.
     * @pathParam {number} benefitId the benefit id
     * @queryParam {boolean} [single=false] if is to update a single installment or all the installments
     * @response 204 - no content.
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/benefits/:id/adjustment')
      .put(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IBenefitController>(
          this.controller,
          'adjustContractById',
        ),
      );
  }

  public simulateAdjustment(): void {
    /**
     * GET /benefits/{benefitId}/adjustment/simulate
     * @tag Benefits
     * @summary simulate the adjusts benefit installments.
     * @security apiKey
     * @description adjusts benefit installments.
     * @pathParam {number} benefitId the benefit id
     * @queryParam {boolean} [single=false] if is to update a single installment or all the installments
     * @response 200 {GetSimulationOfPostponentResponse} - an object with postponent simulation
     * @responseContent {GetSimulationOfPostponentResponse} 200.application/json
     * @responseExample {GetSimulationOfPostponentResponse} 200.application/json.GetBenefitByIdResponse
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
      .route('/benefits/:id/adjustment/simulate')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IBenefitController>(
          this.controller,
          'getPostponementSimulation',
        ),
      );
  }

  private create(): void {
    /**
     * POST /benefits
     * @tag Benefits
     * @security apiKey
     * @summary create a new benefit.
     * @description return the created benefit object.
     * @bodyContent {CreateBenefitPayload} application/json
     * @bodyRequired
     * @response 201 - an object of benefit.
     * @responseContent {CreateBenefitResponse} 201.application/json
     * @responseExample {CreateBenefitResponse} 201.application/json.CreateBenefitResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
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

  private dimissInstallmentByBenefitIdAndInstallmentId(): void {
    /**
     * PATCH /benefits/dimiss/{benefitId}/{installmentId}
     * @tag Benefits
     * @security apiKey
     * @summary dimiss an installment.
     * @description return the created benefit object.
     * @pathParam {number} benefitId
     * @pathParam {number} installmentId
     * @response 204 - no content.
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
      .route('/benefits/dimiss/:benefitId/:installmentId')
      .patch(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IBenefitController>(
          this.controller,
          'dimissInstallMentByBenefitIdAndInstallmentId',
        ),
      );
  }

  setupRoutes(app: Application): void {
    this.create();
    this.getAll();
    this.getById();
    this.adjustment();
    this.simulateAdjustment();
    this.dimissInstallmentByBenefitIdAndInstallmentId();

    app.use(this.router);
  }
}
