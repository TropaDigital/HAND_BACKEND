import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import { createLoanSimulationController } from './factories';
import { ILoanSimulationController } from './interfaces';

export default class LoanSimulationRouter implements IRouter {
  private static instance: LoanSimulationRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: ILoanSimulationController) {}

  public static getInstance(
    controller: ILoanSimulationController = createLoanSimulationController(),
  ): LoanSimulationRouter {
    if (!this.instance) {
      this.instance = new LoanSimulationRouter(controller);
    }

    return this.instance;
  }

  private getLoanSimulationByRequestedValue(): void {
    /**
     * POST /loansimulations/simulate
     * @tag LoanSimulations
     * @summary generate a loan simulation based on parameters provided.
     * @description return an object with the load simulation details.
     * @bodyContent {GetLoanSimulationBasedOnRequestedValuePayload} application/json
     * @bodyDescription payload with the options to generate loan simulation
     * @bodyExample {GetLoanSimulationBasedOnRequestedValuePayloadComplete} application/json.GetLoanSimulationBasedOnRequestedValuePayloadComplete
     * @bodyExample {GetLoanSimulationBasedOnRequestedValuePayloadWithoutConsultantCommission} application/json.GetLoanSimulationBasedOnRequestedValuePayloadWithoutConsultantCommission
     * @bodyExample {GetLoanSimulationBasedOnRequestedValuePayloadWithoutsalaryReceiptDate} application/json.GetLoanSimulationBasedOnRequestedValuePayloadWithoutsalaryReceiptDate
     * @bodyRequired
     * @response 200 - an object with the load simulation details.
     * @responseContent {GetLoanSimulationBasedOnRequestedResponse} 200.application/json
     * @responseExample {GetLoanSimulationWithoutConsultantCommissionResponse} 200.application/json.GetLoanSimulationWithoutConsultantCommissionResponse
     * @responseExample {GetLoanSimulationWithoutTelemedicineResponse} 200.application/json.GetLoanSimulationWithoutTelemedicineResponse
     * @responseExample {GetLoanSimulationWithConsultantCommissionResponse} 200.application/json.GetLoanSimulationWithConsultantCommissionResponse
     * @response 400 - an object with the details of bad request.
     * @responseContent {GetLoanSimulationBadRequestResponse} 400.application/json
     * @responseExample {GetLoanSimulationBadRequest} 400.application/json.GetLoanSimulationBadRequest
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/loansimulations/simulate')
      .post(
        ExpressRouteAdapter.adapt<ILoanSimulationController>(
          this.controller,
          'getLoanSimulationByRequestedValue',
        ),
      );
  }

  setupRoutes(app: Application): void {
    this.getLoanSimulationByRequestedValue();

    app.use(this.router);
  }
}
