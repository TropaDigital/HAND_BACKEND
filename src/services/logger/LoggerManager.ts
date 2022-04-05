import { PinoAdapter } from '../../adapters/logger/PinoAdapter';
import { ILogger, ILoggerParams } from '../../interfaces/logger/ILogger';

export class LoggerManager implements ILogger {
  public constructor(
    private readonly loggers: ILogger[] = [new PinoAdapter()],
  ) {}

  public info(message: ILoggerParams): void {
    this.loggers.forEach(logger => {
      logger.info(message);
    });
  }

  public warning(message: ILoggerParams): void {
    this.loggers.forEach(logger => {
      logger.warning(message);
    });
  }

  public error(message: ILoggerParams): void {
    this.loggers.forEach(logger => {
      logger.error(message);
    });
  }

  public getLoggers(): ILogger[] {
    return [...this.loggers];
  }
}
