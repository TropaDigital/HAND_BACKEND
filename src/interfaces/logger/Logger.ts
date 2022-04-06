import { BaseLogger } from 'pino';

export interface LoggerParams {
  msg: string;
  [key: string]: unknown;
}

export type ILoggerInstance = BaseLogger;

export interface ILogger {
  info(logParams: LoggerParams): void;
  warning(logParams: LoggerParams): void;
  error(logParams: LoggerParams): void;
}
