import { IApiHttpResponse } from '../../interfaces/http';
import {
  IHealthcheckController,
  IHealthCheckResult,
  IHealthcheckService,
} from './interfaces';
import { HealthcheckService } from './service';

export class HealthcheckController implements IHealthcheckController {
  constructor(
    private readonly healthcheckService: IHealthcheckService = new HealthcheckService(),
  ) {}

  public async getApplicationStatus(): Promise<
    IApiHttpResponse<IHealthCheckResult>
  > {
    const result = await this.healthcheckService.getApplicationStatus();
    return {
      statusCodeAsString:
        result.status === 'healthly' ? 'OK' : 'INTERNAL_SERVER_ERROR',
      body: result,
    };
  }
}
