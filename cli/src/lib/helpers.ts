import {existsSync, mkdirpSync, readdirSync, readJsonSync, statSync} from 'fs-extra';
import pino from 'pino';
import { Container } from 'typedi';
import { Config } from './config';
import path from "path";

/**
 * Get the value of an environment variable or throw an error if it is not defined.
 */
export function env(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
}

/**
 * Get the value of an environment variable as a boolean.
 * true: 'true', '1'
 * false: 'false', '0'
 * throw an error if it is not defined or not a valid boolean.
 */
export function envBool(key: string, defaultValue?: boolean): boolean {
  const value = process.env[key];
  if (typeof value === 'undefined') {
    if (typeof defaultValue !== 'undefined') {
      return defaultValue;
    }
    throw new Error(`Missing environment variable ${key}`);
  }

  if (value.toLowerCase() === 'true' || value === '1') {
    return true;
  }
  if (value.toLowerCase() === 'false' || value === '0') {
    return false;
  }
  throw new Error(`Invalid value for environment variable ${key}: ${value}`);
}

/**
 * Get the value of an environment variable as a number.
 * throw an error if it is not defined or not a valid number.
 */
export function envNumber(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (typeof value === 'undefined') {
    if (typeof defaultValue !== 'undefined') {
      return defaultValue;
    }
    throw new Error(`Missing environment variable ${key}`);
  }

  const number = Number(value);
  if (isNaN(number)) {
    throw new Error(`Invalid value for environment variable ${key}: ${value}`);
  }
  return number;
}

export function createDumpFolders(config: Config) {
  const logger = Container.get('logger') as pino.Logger;

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
