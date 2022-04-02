import IDatabaseConnection from '../interfaces/infra/IDatabaseConnection';

export default abstract class AbstractDatabaseConnection
  implements IDatabaseConnection
{
  abstract startConnection(): Promise<unknown | undefined>;

  abstract closeConnection(): Promise<void>;

  abstract getConnectionStatus(): Promise<string> | string;
}
