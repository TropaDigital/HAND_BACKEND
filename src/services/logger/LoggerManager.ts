import { PinoAdapter } from '../../adapters/logger/PinoAdapter';
import { Logger, LoggerParams } from '../../interfaces/logger/Logger';

export class LoggerManager implements Logger {
  public constructor(
    private readonly loggers: Logger[] = [new PinoAdapter()],
  ) {}

  public info(message: LoggerParams): void {
    this.loggers.forEach(logger => {
      logger.info(message);
    });
  }

  public warning(message: LoggerParams): void {
    this.loggers.forEach(logger => {
      logger.warning(message);
    });
  }

  public error(message: LoggerParams): void {
    this.loggers.forEach(logger => {
      logger.error(message);
    });
  }

  public getLoggers(): Logger[] {
    return [...this.loggers];
  }
}
