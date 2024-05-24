import { Command, createCommand, Option } from 'commander';
import { resolve } from 'path';
import { readJSONSync } from 'fs-extra';
import {
  DefaultConfig,
  DefaultConfigPaths,
  disposeContext,
  initContext,
  runDiff,
  runPull,
  runPush,
  runRemovePermissionDuplicates,
  runUntrack,
} from './index';

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
  if (commandOptions.snapshot === true) {
    delete commandOptions.snapshot;
  }
  if (commandOptions.split === true) {
    delete commandOptions.split;
  }
  if (commandOptions.specs === true) {
    delete commandOptions.specs;
  }
  return commandOptions;
}

function wrapAction(program: Command, action: () => Promise<void>) {
  return (commandOpts: Record<string, unknown>) => {
    return initContext(
      cleanProgramOptions(program.opts()),
      cleanCommandOptions(commandOpts),
    )
      .then(action)
      .then(disposeContext);
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

/**
 * Split a comma separated list
 */
function commaSeparatedList(value: string) {
  return value.split(',').map((v) => v.trim());
}

export function createProgram() {
  const program = createCommand();
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
  const dumpPathOption = new Option(
    '--dump-path <dumpPath>',
    `the base path for the dump (default "${DefaultConfig.dumpPath}")`,
  );

  const collectionsPathOption = new Option(
    '--collections-path <collectionPath>',
    `the path for the collections dump, relative to the dump path (default "${DefaultConfig.collectionsPath}")`,
  );
  const excludeCollectionsOption = new Option(
    '-x, --exclude-collections <excludeCollections>',
    `comma separated list of collections to exclude from the process (default to none)`,
  ).argParser(commaSeparatedList);
  const onlyCollectionsOption = new Option(
    '-o, --only-collections <onlyCollections>',
    `comma separated list of collections to include in the process (default to all)`,
  ).argParser(commaSeparatedList);

  const snapshotPathOption = new Option(
    '--snapshot-path <snapshotPath>',
    `the path for the schema snapshot dump, relative to the dump path (default "${DefaultConfig.snapshotPath}")`,
  );
  const noSnapshotOption = new Option(
    '--no-snapshot',
    `should pull and push the Directus schema (default "${DefaultConfig.snapshot}")`,
  );
  const noSplitOption = new Option(
    '--no-split',
    `should split the schema snapshot into multiple files (default "${DefaultConfig.split}")`,
  );

  const specificationsPathOption = new Option(
    '--specs-path <specsPath>',
    `the path for the specifications dump (GraphQL & OpenAPI), relative to the dump path (default "${DefaultConfig.specsPath}")`,
  );
  const noSpecificationsOption = new Option(
    '--no-specs',
    `should dump the GraphQL & OpenAPI specifications (default "${DefaultConfig.specs}")`,
  );

  const forceOption = new Option(
    '-f, --force',
    `force the diff of schema, even if the Directus version is different (default "${DefaultConfig.force}")`,
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
    .addOption(dumpPathOption)
    .addOption(collectionsPathOption)
    .addOption(excludeCollectionsOption)
    .addOption(onlyCollectionsOption)
    .addOption(snapshotPathOption)
    .addOption(noSnapshotOption)
    .addOption(noSplitOption)
    .addOption(specificationsPathOption)
    .addOption(noSpecificationsOption)
    .action(wrapAction(program, runPull));

  program
    .command('diff')
    .description(
      'describe the schema and collections diff. Does not modify the database.',
    )
    .addOption(dumpPathOption)
    .addOption(collectionsPathOption)
    .addOption(excludeCollectionsOption)
    .addOption(onlyCollectionsOption)
    .addOption(snapshotPathOption)
    .addOption(noSnapshotOption)
    .addOption(noSplitOption)
    .addOption(forceOption)
    .action(wrapAction(program, runDiff));

  program
    .command('push')
    .description('push the schema and collections')
    .addOption(dumpPathOption)
    .addOption(collectionsPathOption)
    .addOption(excludeCollectionsOption)
    .addOption(onlyCollectionsOption)
    .addOption(snapshotPathOption)
    .addOption(noSnapshotOption)
    .addOption(noSplitOption)
    .addOption(forceOption)
    .action(wrapAction(program, runPush));

  const helpers = program
    .command('helpers')
    .description('a set of helper utilities');

  helpers
    .command('untrack')
    .description('stop tracking of an element')
    .requiredOption(
      '--collection <collection>',
      'the collection of the element',
    )
    .requiredOption('--id <id>', 'the id of the element to untrack')
    .action(wrapAction(program, runUntrack));

  helpers
    .command('remove-permission-duplicates')
    .description(
      'remove conflicts in permissions when there are duplicated groups "role + collection + action".',
    )
    .option(
      '--keep <keep>',
      `the permission to keep in case of conflict: "first" or "last" (default "${DefaultConfig.keep}")`,
      'last',
    )
    .action(wrapAction(program, runRemovePermissionDuplicates));

  return program;
}
