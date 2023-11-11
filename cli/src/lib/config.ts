import RootPath from 'app-root-path';
import Path from 'path';
import { env, envBool } from './helpers';

const dumpPath = env('DUMP_PATH', RootPath.resolve('dump'));
const snapshotPath = env('SNAPSHOT_PATH', Path.join(dumpPath, 'snapshot'));
const collectionsPath = env(
  'COLLECTIONS_PATH',
  Path.join(dumpPath, 'collections'),
);

export const Config = {
  collections: {
    dumpPath: collectionsPath,
  },
  snapshot: {
    dumpPath: snapshotPath,
    splitFiles: envBool('SNAPSHOT_SPLIT_FILES', true),
  },
};

export type Config = typeof Config;
export type CollectionsConfig = typeof Config.collections;
export type SnapshotConfig = typeof Config.snapshot;
