import Path from 'path';
import { env } from './helpers';

interface ProgramOptions {
  debug: boolean;
  split: boolean;
  dumpPath: string;
  collectionsPath: string;
  snapshotPath: string;
  force: boolean;
  directusUrl?: string;
  directusToken?: string;
}

export function getConfig(options: ProgramOptions) {
  const { dumpPath } = options;
  const snapshotPath = Path.join(dumpPath, options.snapshotPath);
  const collectionsPath = Path.join(dumpPath, options.collectionsPath);

  return {
    logger: {
      level: options.debug ? 'debug' : 'info',
    },
    collections: {
      dumpPath: collectionsPath,
    },
    snapshot: {
      dumpPath: snapshotPath,
      splitFiles: options.split,
      force: options.force,
    },
    directus: {
      url: env('DIRECTUS_URL', options.directusUrl),
      token: env('DIRECTUS_TOKEN', options.directusToken),
    },
  };
}

export type Config = ReturnType<typeof getConfig>;
export type CollectionsConfig = Config['collections'];
export type SnapshotConfig = Config['snapshot'];
export type DirectusConfig = Config['directus'];
