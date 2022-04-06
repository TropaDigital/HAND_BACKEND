import pino from 'pino';

import {
  ILoggerInstance,
  ILogger,
  LoggerParams,
} from '../../interfaces/logger/Logger';

export class PinoAdapter implements ILogger {
  constructor(
    private readonly pinoInstance: ILoggerInstance = pino({
      enabled: true,
      level: 'info',
      prettyPrint: true,
    }),
  ) {}

  public info(params: LoggerParams): void {
    this.pinoInstance.info(params);
  }

  public error(params: LoggerParams): void {
    this.pinoInstance.error(params);
  }

  public warning(params: LoggerParams): void {
    this.pinoInstance.warn(params);
  }
}
