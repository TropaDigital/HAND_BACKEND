import { name, version } from '../../../package.json';
import MySqlDBClient from '../../infra/mySql';
import { IDatabaseConnection } from '../../interfaces/infra/IDatabaseConnection';
import {
  IDatabaseConnectionStatus,
  IHealthCheckResult,
  IHealthcheckService,
} from './interfaces';

export class HealthcheckService implements IHealthcheckService {
  constructor(
    private readonly mySqlClient: IDatabaseConnection = MySqlDBClient.getInstance(),
  ) {}

  private formatConnectionStatus(
    connectionStatus: string,
  ): IDatabaseConnectionStatus {
    return {
      status: ['connected', 'ready'].some(status => connectionStatus === status)
        ? 'healthly'
        : 'unhealthy',
      connectionStatus: connectionStatus || 'disconnected',
    };
  }

  private async getDatabaseConnectionStatus(): Promise<IDatabaseConnectionStatus> {
    try {
      const connectionStatus = await this.mySqlClient.getConnectionStatus();
      return this.formatConnectionStatus(connectionStatus);
    } catch (error) {
      return this.formatConnectionStatus('disconnected');
    }
  }

  public async getApplicationStatus(): Promise<IHealthCheckResult> {
    const databaseStatus = await this.getDatabaseConnectionStatus();
    return {
      name,
      version,
      uptime: `${Math.floor(process.uptime())} secs`,
      status: [databaseStatus].every(({ status }) => status === 'healthly')
        ? 'healthly'
        : 'unhealthy',
      database: databaseStatus,
    };
  }
}
