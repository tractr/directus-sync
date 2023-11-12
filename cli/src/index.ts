import 'reflect-metadata';
import { program } from 'commander';
import {
  disposeContext,
  initContext,
  logEndAndClose,
  logErrorAndStop,
  runDump,
  runPlan,
  runRestore,
} from './lib';
import Path from 'path';

const defaultDumpPath = Path.join(process.cwd(), 'dump');
const defaultSnapshotPath = 'snapshot';
const defaultCollectionsPath = 'collections';

program
  .option('-d, --debug', 'display more logging', false)
  .option(
    '-u, --directus-url <directusUrl>',
    'Directus URL. Can also be set via DIRECTUS_URL env var',
  )
  .option(
    '-t, --directus-token <directusToken>',
    'Directus access token. Can also be set via DIRECTUS_TOKEN env var',
  )
  .option(
    '--no-split',
    'should the schema snapshot be split into multiple files',
    true,
  )
  .option(
    '--dump-path <dumpPath>',
    'the base path for the dump, must be an absolute path',
    defaultDumpPath,
  )
  .option(
    '--collections-path <collectionPath>',
    'the path for the collections dump, relative to the dump path',
    defaultCollectionsPath,
  )
  .option(
    '--snapshot-path <snapshotPath>',
    'the path for the schema snapshot dump, relative to the dump path',
    defaultSnapshotPath,
  );

registerCommand('dump', 'dump the schema and collections', runDump);
registerCommand(
  'plan',
  'describe the schema and collections restoration plan',
  runPlan,
);
registerCommand('restore', 'restore the schema and collections', runRestore);

program.parse(process.argv);

function registerCommand(
  name: string,
  description: string,
  action: () => Promise<void>,
) {
  return program
    .command(name)
    .description(description)
    .action(() => {
      return initContext(program.opts())
        .then(action)
        .catch(logErrorAndStop)
        .then(disposeContext)
        .then(logEndAndClose);
    });
}
