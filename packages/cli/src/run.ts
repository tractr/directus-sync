import { createProgram, Logger, LoggerService, LOGGER_TRANSPORT } from './lib';
import { Container } from 'typedi';

function getLogger(): Logger | Console {
  return Container.has(LOGGER_TRANSPORT) ? Container.get(LoggerService) : console;
}

export function run() {
  return createProgram()
    .parseAsync(process.argv)
    .catch((error: string | Error) => {
      const logger = getLogger();
      logger.error(error);
      process.exit(1);
    })
    .then(() => {
      const logger = getLogger();
      logger.info(`✅  Done!`);
      process.exit(0);
    });
}
