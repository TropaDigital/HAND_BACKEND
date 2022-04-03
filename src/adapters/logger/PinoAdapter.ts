import pino from 'pino';

import {
  ILoggerInstance,
  Logger,
  LoggerParams,
} from '../../interfaces/logger/Logger';

export class PinoAdapter implements Logger {
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
