import { Options } from './interfaces';

export const DefaultConfig: Partial<Options> = {
  // Global
  configPath: './directus-sync.config.js',
  debug: false,
  // Pull, diff, push
  dumpPath: './directus-config',
  collectionsPath: 'collections',
  snapshotPath: 'snapshot',
  split: true,
  // Diff, push
  force: false,
};
