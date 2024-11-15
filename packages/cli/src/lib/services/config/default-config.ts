import { Options } from './interfaces';

export const DefaultConfigPaths = [
  './directus-sync.config.js',
  './directus-sync.config.cjs',
  './directus-sync.config.json',
];

const defaultDumpPath = './directus-config';
export const DefaultConfig: Pick<
  Options,
  | 'debug'
  | 'dumpPath'
  | 'collectionsPath'
  | 'excludeCollections'
  | 'onlyCollections'
  | 'preserveIds'
  | 'snapshotPath'
  | 'snapshot'
  | 'split'
  | 'specsPath'
  | 'specs'
  | 'seedPath'
  | 'force'
  | 'keep'
> = {
  // Global
  debug: false,
  // Pull, diff, push
  dumpPath: defaultDumpPath,
  // Collections
  collectionsPath: 'collections',
  excludeCollections: [],
  onlyCollections: [],
  preserveIds: [],
  // Snapshot
  snapshotPath: 'snapshot',
  snapshot: true,
  split: true,
  // Specifications
  specsPath: 'specs',
  specs: true,
  // Seed
  seedPath: `${defaultDumpPath}/seed`,
  // Diff, push
  force: false,
  // Remove Permission Duplicates
  keep: 'last',
};
