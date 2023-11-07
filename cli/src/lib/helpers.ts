import RootPath from 'app-root-path';
import { existsSync, mkdirSync } from 'fs';
import * as Path from 'path';
import { logger } from './logger';

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
