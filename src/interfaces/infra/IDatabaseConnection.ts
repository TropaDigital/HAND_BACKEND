export interface IDatabaseConnection {
  startConnection: () => Promise<unknown | undefined>;
  closeConnection: () => Promise<void>;
  getConnectionStatus: () => Promise<string> | string;
}
