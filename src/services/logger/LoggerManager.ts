import { PinoAdapter } from '../../adapters/logger/PinoAdapter';
import { ILogger, LoggerParams } from '../../interfaces/logger/Logger';

export class LoggerManager implements ILogger {
  public constructor(
    private readonly loggers: ILogger[] = [new PinoAdapter()],
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

  public getLoggers(): ILogger[] {
    return [...this.loggers];
  }
}
