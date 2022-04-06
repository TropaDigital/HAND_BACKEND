import { IApiHttpRequest, IApiHttpResponse } from 'src/interfaces/http';

export interface IDatabaseConnectionStatus {
  status: 'healthly' | 'unhealthy';
  connectionStatus: string;
}

export interface IHealthCheckResult {
  name: string;
  version: string;
  uptime: string;
  status: 'healthly' | 'unhealthy';
  database: IDatabaseConnectionStatus;
}

export interface IHealthcheckService {
  getApplicationStatus: () => Promise<IHealthCheckResult>;
}

export interface IHealthcheckController {
  getApplicationStatus: (
    _request: IApiHttpRequest,
  ) => Promise<IApiHttpResponse<IHealthCheckResult>>;
}
