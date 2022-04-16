import App from './App';
import { ExitedStatus } from './enums/ExitedStatus';
import { LoggerFactory } from './factories/LoggerFactory';

const Logger = LoggerFactory.create();

process.on('uncaughtException', (error: Error) => {
  Logger.error({
    msg: `uncaughtException - ${error.message}`,
    stack: error.stack,
  });
  process.exit(ExitedStatus.FAILURE);
});
process.on('unhandledRejection', (reason: Error) => {
  Logger.error({
    msg: `unhandledRejection - ${reason.message}`,
    stack: reason.stack,
  });
  throw reason;
});

function handleExitSignal(signal: NodeJS.Signals, appInstance: App): void {
  process.on(signal, async (): Promise<void> => {
    try {
      await appInstance.stopApplication();
      Logger.info({ msg: `app exited with success` });
      process.exit(ExitedStatus.SUCCESS);
    } catch (error) {
      if (error instanceof Error) {
        Logger.error({
          msg: `error to exit application: ${error.message}`,
          stack: error.stack,
        });
      }

      Logger.error({ msg: `error to exit application` });
      process.exit(ExitedStatus.FAILURE);
    }
  });
}

(async () => {
  try {
    const app = new App();
    await app.initApplication();
    app.initServer();
    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    exitSignals.forEach(sinal => handleExitSignal(sinal, app));
  } catch (error) {
    Logger.error({
      msg: `App exited with error: ${error}`,
    });

    process.exit(ExitedStatus.FAILURE);
  }
})();
