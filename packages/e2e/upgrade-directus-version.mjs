#!/usr/bin/env zx
import 'dotenv/config';
import path from 'path';
import { readdir } from 'fs/promises';
import { readFileSync, writeFileSync } from 'fs';

async function readJSON(path) {
  return JSON.parse(await readFileSync(path, 'utf8'));
}
async function writeJSON(path, data) {
  await writeFileSync(path, JSON.stringify(data, null, 2));
}

const actual = '11.9.3';
const next = '11.9.3';

if (actual === next) {
  console.log('Nothing to upgrade');
  process.exit(0);
}

const { PUBLIC_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

// List all folders of ./dumps/sources using path
const sources = await readdir(path.resolve('dumps', 'sources'));
const cliPackagePath = path.resolve('..', 'cli', 'package.json');
const cliPackage = await readJSON(cliPackagePath);
const { version } = cliPackage;
const cliProgramArgs = [
  '--directus-url',
  PUBLIC_URL,
  '--directus-email',
  ADMIN_EMAIL,
  '--directus-password',
  ADMIN_PASSWORD,
];

// Change the version of directus-sync in package.json to avoid conflicts
cliPackage.version = `${cliPackage.version}-next`;
await writeJSON(cliPackagePath, cliPackage);

// Ensure latest version of directus-sync is installed
console.log(
  chalk.yellow(
    '---> Ensure the latest version of directus-sync from npm is installed',
  ),
);
console.log(
  chalk.yellow(
    `If the following command fails or never ends, please run "npx directus-sync@${version} --version" manually from another directory to fix the issue`,
  ),
);
await $`npx directus-sync@${version} --version`;

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
    () =>
      $`npx directus-sync@${version} ${cliProgramArgs} push ${cliCommandArgs}`, // Use current version of directus-sync
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
    () => $`npx directus-sync ${cliProgramArgs} pull ${cliCommandArgs}`, // Use next version of directus-sync
  );
  serverProcess.kill('SIGINT');
  await serverProcess.catch(() =>
    console.log(chalk.yellow('---> Server stopped')),
  );

  console.log(chalk.green(`===> ${source} upgraded successfully`));
}

// Restore the version of directus-sync in package.json using git
await $`git checkout -- ${cliPackagePath}`;
