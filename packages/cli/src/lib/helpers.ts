import {
  existsSync,
  mkdirpSync,
  readdirSync,
  readJsonSync,
  statSync,
} from 'fs-extra';
import { z, ZodError, ZodSchema } from 'zod';
import pino, { LoggerOptions } from 'pino';
import { Container } from 'typedi';
import path from 'path';
import { LOGGER, LOGGER_TRANSPORT } from './constants';
import { ConfigService } from './services';

export function createDumpFolders() {
  const logger: pino.Logger = Container.get(LOGGER);
  const config = Container.get(ConfigService);

  const collectionsConfig = config.getCollectionsConfig();
  if (!existsSync(collectionsConfig.dumpPath)) {
    logger.info('Create dump folder for collections');
    mkdirpSync(collectionsConfig.dumpPath);
  }

  const snapshotConfig = config.getSnapshotConfig();
  if (!existsSync(snapshotConfig.dumpPath)) {
    logger.info('Create dump folder for snapshot');
    mkdirpSync(snapshotConfig.dumpPath);
  }
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
  if (!existsSync(dirPath)) {
    return files;
  }
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

/**
 * Validate an object against a zod schema and format the error if it fails
 */
export function zodParse<T extends ZodSchema>(
  payload: unknown,
  schema: T,
  errorContext?: string,
): z.infer<T> {
  try {
    return schema.parse(payload);
  } catch (error) {
    const message =
      error instanceof ZodError
        ? error.issues
            .map((e) => `[${e.path.join(',')}] ${e.message}`)
            .join('. ')
        : (error as string);
    const fullMessage = errorContext ? `${errorContext}: ${message}` : message;
    throw new Error(fullMessage);
  }
}

export function getPinoTransport(): LoggerOptions['transport'] {
  // Allow to override the log output when running as a programmatic way (not CLI, i.e. tests)
  if (Container.has(LOGGER_TRANSPORT)) {
    return Container.get(LOGGER_TRANSPORT);
  }
  return {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}
