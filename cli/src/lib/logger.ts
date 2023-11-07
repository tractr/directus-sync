import Logger from 'pino';

export const logger = Logger({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  level: 'debug',
});

/**
 * Helper for logging error.
 */
export function logErrorAndStop(error: string | Error, code = 1) {
  logger.error(error);
  process.exit(code);
}

/**
 * Helper for logging success.
 */
export function logEndAndClose() {
  logger.info(`✅  Done!`);
  process.exit(0);
}
