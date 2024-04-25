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
  | 'snapshotPath'
  | 'split'
  | 'force'
  | 'specs'
  | 'specsPath'
  | 'excludeCollections'
  | 'onlyCollections'
> = {
  // Global
  debug: false,
  // Pull, diff, push
  dumpPath: './directus-config',
  collectionsPath: 'collections',
  snapshotPath: 'snapshot',
  split: true,
  // Specifications
  specs: true,
  specsPath: 'specs',
  // Diff, push
  force: false,
  // Exclusion and Inclusion
  excludeCollections: [],
  onlyCollections: [],
};
