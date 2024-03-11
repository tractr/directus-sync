import 'dotenv/config';
import 'reflect-metadata';
import { Option, program } from 'commander';
import { resolve } from 'path';
import { readJSONSync } from 'fs-extra';
import {
  DefaultConfig,
  DefaultConfigPaths,
  disposeContext,
  initContext,
  logEndAndClose,
  logErrorAndStop,
  runDiff,
  runPull,
  runPush,
  runUntrack,
} from './lib';

// Global options
const debugOption = new Option(
  '-d, --debug',
  `display more logging (default "${DefaultConfig.debug}")`,
);
const directusUrlOption = new Option(
  '-u, --directus-url <directusUrl>',
  'Directus URL',
).env('DIRECTUS_URL');
const directusTokenOption = new Option(
  '-t, --directus-token <directusToken>',
  'Directus access token',
).env('DIRECTUS_TOKEN');
const directusEmailOption = new Option(
  '-e, --directus-email <directusEmail>',
  'Directus user email',
).env('DIRECTUS_ADMIN_EMAIL');
const directusPasswordOption = new Option(
  '-p, --directus-password <directusPassword>',
  'Directus user password',
).env('DIRECTUS_ADMIN_PASSWORD');
const configPathOption = new Option(
  '-c, --config-path <configPath>',
  `the path to the config file. Required for extended options (default paths: ${DefaultConfigPaths.join(
    ', ',
  )})`,
);

// Shared options
const noSplitOption = new Option(
  '--no-split',
  `should the schema snapshot be split into multiple files (default "${DefaultConfig.split}")`,
);
const dumpPathOption = new Option(
  '--dump-path <dumpPath>',
  `the base path for the dump (default "${DefaultConfig.dumpPath}")`,
);
const collectionsPathOption = new Option(
  '--collections-path <collectionPath>',
  `the path for the collections dump, relative to the dump path (default "${DefaultConfig.collectionsPath}")`,
);
const snapshotPathOption = new Option(
  '--snapshot-path <snapshotPath>',
  `the path for the schema snapshot dump, relative to the dump path (default "${DefaultConfig.snapshotPath}")`,
);
const forceOption = new Option(
  '-f, --force',
  `force the diff of schema, even if the Directus version is different (default "${DefaultConfig.force}")`,
);
const specificationsPathOption = new Option(
  '--specs-path <specificationsPath>',
  `the path for the specifications dump (GraphQL & OpenAPI), relative to the dump path (default "${DefaultConfig.specificationsPath}")`,
);
const noSpecificationsOption = new Option(
  '--no-specs',
  `should dump the GraphQL & OpenAPI specifications (default "${DefaultConfig.specifications}")`,
);

program
  .version(getVersion())
  .addOption(debugOption)
  .addOption(directusUrlOption)
  .addOption(directusTokenOption)
  .addOption(directusEmailOption)
  .addOption(directusPasswordOption)
  .addOption(configPathOption);

program
  .command('pull')
  .description('get the schema and collections and store them locally')
  .addOption(noSplitOption)
  .addOption(dumpPathOption)
  .addOption(collectionsPathOption)
  .addOption(snapshotPathOption)
  .addOption(noSpecificationsOption)
  .addOption(specificationsPathOption)
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

/**
 * Remove some default values from the program options that overrides the config file
 */
function cleanProgramOptions(programOptions: Record<string, unknown>) {
  return programOptions;
}

/**
 * Remove some default values from the command options that overrides the config file
 */
function cleanCommandOptions(commandOptions: Record<string, unknown>) {
  if (commandOptions.split === true) {
    delete commandOptions.split;
  }
  return commandOptions;
}

function wrapAction(action: () => Promise<void>) {
  return (commandOpts: Record<string, unknown>) => {
    return initContext(
      cleanProgramOptions(program.opts()),
      cleanCommandOptions(commandOpts),
    )
      .then(action)
      .catch(logErrorAndStop)
      .then(disposeContext)
      .then(logEndAndClose);
  };
}

function getVersion(): string {
  try {
    const { version } = readJSONSync(
      resolve(__dirname, '..', 'package.json'),
    ) as { version?: string };
    return version ?? 'undefined';
  } catch (e) {
    return 'error';
  }
}
