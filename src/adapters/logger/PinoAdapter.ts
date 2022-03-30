import pino from 'pino';

import { Logger, LoggerParams } from '../../interfaces/logger/Logger';

export default class PinoAdapter implements Logger {
  private readonly pino;

  constructor() {
    this.pino = pino();
  }

  public info(params: LoggerParams): void {
    this.pino.info(params);
  }

  public error(params: LoggerParams): void {
    this.pino.error(params);
  }

  public warning(params: LoggerParams): void {
    this.pino.warn(params);
  }
}
