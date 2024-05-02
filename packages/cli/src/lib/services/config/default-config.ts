import { Options } from './interfaces';

export const DefaultConfigPaths = [
  './directus-sync.config.js',
  './directus-sync.config.cjs',
  './directus-sync.config.json',
];

export const DefaultConfig: Pick<
  Options,
  | 'debug'
  | 'dumpPath'
  | 'collectionsPath'
  | 'excludeCollections'
  | 'onlyCollections'
  | 'snapshotPath'
  | 'snapshot'
  | 'split'
  | 'specsPath'
  | 'specs'
  | 'force'
  | 'keep'
> = {
  // Global
  debug: false,
  // Pull, diff, push
  dumpPath: './directus-config',
  // Collections
  collectionsPath: 'collections',
  excludeCollections: [],
  onlyCollections: [],
  // Snapshot
  snapshotPath: 'snapshot',
  snapshot: true,
  split: true,
  // Specifications
  specsPath: 'specs',
  specs: true,
  // Diff, push
  force: false,
  // Remove Permission Duplicates
  keep: 'last',
};
