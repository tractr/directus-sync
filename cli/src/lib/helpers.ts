import {
  existsSync,
  mkdirpSync,
  readdirSync,
  readJsonSync,
  statSync,
} from 'fs-extra';
import pino from 'pino';
import { Container } from 'typedi';
import { Config } from './config';
import path from 'path';
import { LOGGER } from './constants';

export function createDumpFolders(config: Config) {
  const logger = Container.get(LOGGER) as pino.Logger;

  if (!existsSync(config.collections.dumpPath)) {
    logger.info('Create dump folder for collections');
    mkdirpSync(config.collections.dumpPath);
  }
  if (!existsSync(config.snapshot.dumpPath)) {
    logger.info('Create dump folder for snapshot');
    mkdirpSync(config.snapshot.dumpPath);
  }
}

/**
 * Helper for logging error.
 */
export function logErrorAndStop(error: string | Error, code = 1) {
  const logger = Container.get(LOGGER) as pino.Logger;
  logger.error(error);
  process.exit(code);
}

/**
 * Helper for logging success.
 */
export function logEndAndClose() {
  const logger = Container.get(LOGGER) as pino.Logger;
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

/**
 * Load all JSON files from a directory recursively.
 */
export function loadJsonFilesRecursively<T>(dirPath: string): T[] {
  const files: T[] = [];
  const fileNames = readdirSync(dirPath);
  for (const fileName of fileNames) {
    const filePath = path.join(dirPath, fileName);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      files.push(...loadJsonFilesRecursively<T>(filePath));
    } else if (fileName.endsWith('.json')) {
      files.push(readJsonSync(filePath, 'utf-8') as T);
    }
  }
  return files;
}
