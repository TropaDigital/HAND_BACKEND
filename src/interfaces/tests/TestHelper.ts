import { ILogger } from '../logger/ILogger';

export const makeLoggerStub = (): jest.Mocked<ILogger> => ({
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
});
