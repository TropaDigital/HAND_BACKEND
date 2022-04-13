import { IApiHttpRequest, IApiHttpResponse } from 'src/interfaces/http';

import { IValidator } from '../../interfaces/validation/IValidator';
import {
  ILoanSimulationBasedOnRequestedValue,
  ILoanSimulationBasedOnRequestedValueParams,
  ILoanSimulationController,
  ILoanSimulationService,
} from './interfaces';
import * as schemas from './schemas';

export class LoanSimulationController implements ILoanSimulationController {
  constructor(
    private readonly loanSimulationService: ILoanSimulationService,
    private readonly validator: IValidator<typeof schemas>,
  ) {}

  public async getLoanSimulationByRequestedValue(
    httpRequest: IApiHttpRequest<ILoanSimulationBasedOnRequestedValueParams>,
  ): Promise<IApiHttpResponse<ILoanSimulationBasedOnRequestedValue>> {
    const payload =
      this.validator.validateSchema<ILoanSimulationBasedOnRequestedValueParams>(
        'GetLoanSimulationByRequestedValue',
        httpRequest.body,
      );

    const loanSimulation =
      await this.loanSimulationService.simulateLoanBasedOnRequestedValue(
        payload,
      );

    return {
      statusCodeAsString: 'OK',
      body: loanSimulation,
    };
  }
}
