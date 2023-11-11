import Path from 'path';

type ProgramOptions = {
  debug: boolean;
  split: boolean;
  dumpPath: string;
  collectionsPath: string;
  snapshotPath: string;
};

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
    },
  };
}

export type Config = ReturnType<typeof getConfig>;
export type CollectionsConfig = Config['collections'];
export type SnapshotConfig = Config['snapshot'];
