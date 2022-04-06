import { BaseLogger } from 'pino';

export interface ILoggerParams {
  msg: string;
  [key: string]: unknown;
}

export type ILoggerInstance = BaseLogger;

export interface ILogger {
  info(logParams: ILoggerParams): void;
  warning(logParams: ILoggerParams): void;
  error(logParams: ILoggerParams): void;
}
