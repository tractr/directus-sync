#!/usr/bin/env zx
import 'dotenv/config';
import path from 'path';
import {readdir} from 'fs/promises';

const actual = '10.13.2';
const next = '11.0.2';

if (actual === next) {
  console.log('Nothing to upgrade');
  process.exit(0);
}

const { PUBLIC_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

// List all folders of ./dumps/sources using path
const sources = await readdir(path.resolve('dumps', 'sources'));
const cliEntrypoint = path.resolve('..', 'cli', 'bin', 'index.js');
const cliProgramArgs = [
  '--directus-url',
  PUBLIC_URL,
  '--directus-email',
  ADMIN_EMAIL,
  '--directus-password',
  ADMIN_PASSWORD,
];

for (const source of sources) {
  // Compute source path
  const sourcePath = path.resolve('dumps', 'sources', source);
  const cliCommandArgs = ['--dump-path', sourcePath];

  // log step
  console.log(
    chalk.magenta(`===> Upgrading ${source} from ${actual} to ${next}`),
  );

  // Install the current version
  console.log(chalk.yellow('---> Installing the current version'));
  await $`npm install --save --save-exact directus@${actual}`;

  // Bootstrap the Directus database
  console.log(chalk.yellow('---> Bootstrapping the database'));
  await $`npm run bootstrap`;

  // Start the Directus server
  console.log(chalk.yellow('---> Starting the server'));
  let serverProcess = $`npx directus start`;
  await spinner('Wait for server', () =>
    retry(20, '1s', () => fetch(`${PUBLIC_URL}/server/health`)),
  );

  // Push the dump to the server
  console.log(chalk.yellow('---> Pushing the dump to the instance'));
  await spinner(
    'Pushing the configuration',
    () => $`npx directus-sync ${cliProgramArgs} push ${cliCommandArgs}`, // Use current version of directus-sync
  );
  serverProcess.kill('SIGINT');
  await serverProcess.catch(() =>
    console.log(chalk.yellow('---> Server stopped')),
  );

  // Install the next version
  console.log(chalk.yellow('---> Installing the next version'));
  await $`npm install --save --save-exact directus@${next}`;

  // Apply the latest migrations
  console.log(chalk.yellow('---> Apply latest migrations'));
  await $`npx directus database migrate:latest`;

  // Start the Directus server and run the migrations
  console.log(chalk.yellow('---> Starting the new server'));
  serverProcess = $`npx directus start`;
  await spinner('Wait for server', () =>
    retry(20, '1s', () => fetch(`${PUBLIC_URL}/server/health`)),
  );

  // Pull the dump from the server
  console.log(chalk.yellow('---> Pulling the dump from the instance'));
  await spinner(
    'Pulling the configuration',
    () => $`node ${cliEntrypoint} ${cliProgramArgs} pull ${cliCommandArgs}`, // Use next version of directus-sync
  );
  serverProcess.kill('SIGINT');
  await serverProcess.catch(() =>
    console.log(chalk.yellow('---> Server stopped')),
  );

  console.log(chalk.green(`===> ${source} upgraded successfully`));
}
