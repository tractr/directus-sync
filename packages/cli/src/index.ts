import 'dotenv/config';
import 'reflect-metadata';
import { Command, Option, program } from 'commander';
import {
  CommandName,
  CommandsOptions,
  disposeContext,
  initContext,
  logEndAndClose,
  logErrorAndStop,
  runDiff,
  runPull,
  runPush,
  runUntrack,
} from './lib';
import Path from 'path';

const defaultDumpPath = Path.join(process.cwd(), 'directus-config');
const defaultSnapshotPath = 'snapshot';
const defaultCollectionsPath = 'collections';

// Global options
const debugOption = new Option('-d, --debug', 'display more logging').default(
  false,
);
const directusUrlOption = new Option(
  '-u, --directus-url <directusUrl>',
  'Directus URL',
).env('DIRECTUS_URL');
const directusTokenOption = new Option(
  '-t, --directus-token <directusToken>',
  'Directus access token',
).env('DIRECTUS_TOKEN');

// Shared options
const noSplitOption = new Option(
  '--no-split',
  'should the schema snapshot be split into multiple files',
).default(true);
const dumpPathOption = new Option(
  '--dump-path <dumpPath>',
  'the base path for the dump, must be an absolute path',
).default(defaultDumpPath);
const collectionsPathOption = new Option(
  '--collections-path <collectionPath>',
  'the path for the collections dump, relative to the dump path',
).default(defaultCollectionsPath);
const snapshotPathOption = new Option(
  '--snapshot-path <snapshotPath>',
  'the path for the schema snapshot dump, relative to the dump path',
).default(defaultSnapshotPath);
const forceOption = new Option(
  '-f, --force',
  'force the diff of schema, even if the Directus version is different',
).default(false);

program
  .addOption(debugOption)
  .addOption(directusUrlOption)
  .addOption(directusTokenOption);

program
  .command('pull')
  .description('get the schema and collections and store them locally')
  .addOption(noSplitOption)
  .addOption(dumpPathOption)
  .addOption(collectionsPathOption)
  .addOption(snapshotPathOption)
  .action(wrapAction(runPull));

program
  .command('diff')
  .description(
    'describe the schema and collections diff. Does not modify the database.',
  )
  .addOption(noSplitOption)
  .addOption(dumpPathOption)
  .addOption(collectionsPathOption)
  .addOption(snapshotPathOption)
  .addOption(forceOption)
  .action(wrapAction(runDiff));

program
  .command('push')
  .description('push the schema and collections')
  .addOption(noSplitOption)
  .addOption(dumpPathOption)
  .addOption(collectionsPathOption)
  .addOption(snapshotPathOption)
  .addOption(forceOption)
  .action(wrapAction(runPush));

program
  .command('untrack')
  .description('stop tracking of an element')
  .requiredOption(
    '-c, --collection <collection>',
    'the collection of the element',
  )
  .requiredOption('-i, --id <id>', 'the id of the element to untrack')
  .action(wrapAction(runUntrack));

program.parse(process.argv);

function wrapAction(action: () => Promise<void>) {
  return (commandOpts: CommandsOptions[CommandName], command: Command) => {
    return initContext(
      program.opts(),
      command.name() as CommandName,
      commandOpts,
    )
      .then(action)
      .catch(logErrorAndStop)
      .then(disposeContext)
      .then(logEndAndClose);
  };
}
