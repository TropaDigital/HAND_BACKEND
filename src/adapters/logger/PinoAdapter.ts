import pino from 'pino';

import { loggerConfig } from '../../config/logger';
import {
  ILoggerInstance,
  ILogger,
  ILoggerParams,
} from '../../interfaces/logger/ILogger';

export class PinoAdapter implements ILogger {
  constructor(
    private readonly pinoInstance: ILoggerInstance = pino({
      enabled: loggerConfig().LOGGER_ENABLED,
      level: loggerConfig().LOGGER_LEVEL || 'info',
      prettyPrint: loggerConfig().LOGGER_PRETTY_PRINT,
    }),
  ) {}

  public info(params: ILoggerParams): void {
    this.pinoInstance.info(params);
  }

  public error(params: ILoggerParams): void {
    this.pinoInstance.error(params);
  }

  public warning(params: ILoggerParams): void {
    this.pinoInstance.warn(params);
  }
}
