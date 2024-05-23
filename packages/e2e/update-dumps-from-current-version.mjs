#!/usr/bin/env zx
import 'dotenv/config';
import path from 'path';
import { readdir } from 'fs/promises';

const { PUBLIC_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

// List all folders of ./dumps/sources using path
const sources = await readdir(path.resolve('dumps', 'sources'));
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
  console.log(chalk.magenta(`===> Updating ${source}`));

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
    () => $`npx directus-sync ${cliProgramArgs} push ${cliCommandArgs}`,
  );

  // Pull the dump from the server
  console.log(chalk.yellow('---> Pulling the dump from the instance'));
  await spinner(
    'Pulling the configuration',
    () => $`npx directus-sync ${cliProgramArgs} pull ${cliCommandArgs}`,
  );
  serverProcess.kill('SIGINT');
  await serverProcess.catch(() =>
    console.log(chalk.yellow('---> Server stopped')),
  );

  console.log(chalk.green(`===> ${source} updated successfully`));
}
