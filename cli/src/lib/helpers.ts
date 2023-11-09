import RootPath from 'app-root-path';
import { existsSync, mkdirSync } from 'fs';
import * as Path from 'path';
import pino from 'pino';
import { Container } from 'typedi';

/**
 * Get the path to the root of the project
 */
export function getDumpFilesPaths() {
  const dumpDirPath = RootPath.resolve('dump');
  const directusSnapshotPath = Path.join(dumpDirPath, 'snapshot.yaml');
  const directusDumpPath = Path.join(dumpDirPath, 'directus');

  return {
    dumpDirPath,
    directusSnapshotPath,
    directusDumpPath,
  };
}

export function createDumpFolders() {
  const logger = Container.get('logger') as pino.Logger;
  const { dumpDirPath, directusDumpPath } = getDumpFilesPaths();

  if (!existsSync(dumpDirPath)) {
    logger.info('Create dump folder');
    mkdirSync(dumpDirPath, { recursive: true });
  }
  if (!existsSync(directusDumpPath)) {
    logger.info('Create directus dump folder');
    mkdirSync(directusDumpPath, { recursive: true });
  }
}

/**
 * Helper for logging error.
 */
export function logErrorAndStop(error: string | Error, code = 1) {
  const logger = Container.get('logger') as pino.Logger;
  logger.error(error);
  process.exit(code);
}

/**
 * Helper for logging success.
 */
export function logEndAndClose() {
  const logger = Container.get('logger') as pino.Logger;
  logger.info(`✅  Done!`);
  process.exit(0);
}

/**
 * Helper for getting a child logger that adds a prefix to the log messages.
 */
export function getChildLogger(
  baseLogger: pino.Logger,
  prefix: string,
): pino.Logger {
  return baseLogger.child(
    {},
    {
      msgPrefix: `[${prefix}] `,
    },
  );
}
