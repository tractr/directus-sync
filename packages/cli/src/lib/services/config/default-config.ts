import { Options } from './interfaces';

export const DefaultConfigPaths = [
  './directus-sync.config.js',
  './directus-sync.config.cjs',
  './directus-sync.config.json',
];

export const DefaultConfig: Pick<
  Options,
  'debug' | 'dumpPath' | 'collectionsPath' | 'snapshotPath' | 'split' | 'force'
> = {
  // Global
  debug: false,
  // Pull, diff, push
  dumpPath: './directus-config',
  collectionsPath: 'collections',
  snapshotPath: 'snapshot',
  split: true,
  // Diff, push
  force: false,
};
