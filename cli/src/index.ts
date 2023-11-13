import 'reflect-metadata';
import {program} from 'commander';
import {disposeContext, initContext, logEndAndClose, logErrorAndStop, runDiff, runPull, runPush,} from './lib';
import Path from 'path';

const defaultDumpPath = Path.join(process.cwd(), 'directus-config');
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

registerCommand('pull', 'get the schema and collections and store them locally', runPull);
registerCommand(
    'diff',
    'describe the schema and collections diff. Does not modify the database.',
    runDiff
);
registerCommand('push', 'push the schema and collections', runPush);

program.parse(process.argv);

function registerCommand(
    name: string,
    description: string,
    action: () => Promise<void>
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
