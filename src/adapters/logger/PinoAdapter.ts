import pino from 'pino';

import {
  ILoggerInstance,
  ILogger,
  ILoggerParams,
} from '../../interfaces/logger/ILogger';

export class PinoAdapter implements ILogger {
  constructor(
    private readonly pinoInstance: ILoggerInstance = pino({
      enabled: process.env.NODE_ENV !== 'test',
      level: 'info',
      prettyPrint: true,
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
