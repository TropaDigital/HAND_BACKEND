import PinoAdapter from '../adapters/logger/PinoAdapter';
import { LoggerManager } from '../services/logger/LoggerManager';

export class LoggerFactory {
  public static create(): LoggerManager {
    const pinoAdapter = new PinoAdapter();
    return new LoggerManager(pinoAdapter);
  }
}
