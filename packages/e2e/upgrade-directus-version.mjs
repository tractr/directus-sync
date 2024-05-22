#!/usr/bin/env zx
import 'dotenv/config';
import path from 'path';
import { readdir } from 'fs/promises';

const { PUBLIC_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const actual = '10.10.4';
const next = '10.11.1';

if (actual === next) {
  console.log('Nothing to upgrade');
  process.exit(0);
}

// List all folders of ./dumps/sources using path
const sources = await readdir(path.resolve('dumps', 'sources'));

for (const source of sources) {
  // Compute source path
  const sourcePath = path.resolve('dumps', 'sources', source);

  // log step
  console.log(
    chalk.magenta(`===> Upgrading ${source} from ${actual} to ${next}`),
  );

  // Install the current version
  console.log(chalk.yellow('---> Installing the current version'));
  await $`npm install directus@${actual}`;

  // Bootstrap the Directus database
  console.log(chalk.yellow('---> Bootstrapping the database'));
  await $`npm run bootstrap`;

  // Start the Directus server
  console.log(chalk.yellow('---> Starting the server'));
  let serverProcess = $`npm run start`;
  await spinner('Wait for server', () =>
    retry(20, '1s', () => fetch(`${PUBLIC_URL}/server/health`)),
  );

  // Push the dump to the server
  console.log(chalk.yellow('---> Pushing the dump to the instance'));
  await spinner('Pushing the configuration', () =>
    $(directusSync(sourcePath, 'push')),
  );
  serverProcess.kill('SIGINT');
  await serverProcess.catch(() =>
    console.log(chalk.yellow('---> Server stopped')),
  );

  // Install the next version
  console.log(chalk.yellow('---> Installing the next version'));
  await $`npm install directus@${next}`;

  // Start the Directus server and run the migrations
  console.log(chalk.yellow('---> Starting the new server'));
  serverProcess = $`npm run start`;
  await spinner('Wait for server', () =>
    retry(20, '1s', () => fetch(`${PUBLIC_URL}/server/health`)),
  );

  // Pull the dump from the server
  console.log(chalk.yellow('---> Pulling the dump from the instance'));
  await spinner('Pulling the configuration', () =>
    $(directusSync(sourcePath, 'pull')),
  );
  serverProcess.kill('SIGINT');
  await serverProcess.catch(() =>
    console.log(chalk.yellow('---> Server stopped')),
  );

  console.log(chalk.green(`===> ${source} upgraded successfully`));
}

function directusSync(dumpPath, command) {
  const programArgs = [
    '--directus-url',
    PUBLIC_URL,
    '--directus-email',
    ADMIN_EMAIL,
    '--directus-password',
    ADMIN_PASSWORD,
  ];
  const commandArgs = ['--dump-path', dumpPath];

  return `npx directus-sync ${programArgs.join(
    ' ',
  )} ${command} ${commandArgs.join(' ')}`;
}
