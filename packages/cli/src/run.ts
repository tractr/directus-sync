import { createProgram, LOGGER } from './lib';
import pino from 'pino';
import { Container } from 'typedi';

export function run() {
  return createProgram()
    .parseAsync(process.argv)
    .catch((error: string | Error) => {
      const logger: pino.Logger = Container.get(LOGGER);
      logger.error(error);
      process.exit(1);
    })
    .then(() => {
      const logger: pino.Logger = Container.get(LOGGER);
      logger.info(`✅  Done!`);
      process.exit(0);
    });
}
