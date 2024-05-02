import { createProgram, LOGGER } from './lib';
import pino from 'pino';
import { Container } from 'typedi';

function getLogger(): pino.Logger | Console {
  return Container.has(LOGGER) ? Container.get(LOGGER) : console;
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
