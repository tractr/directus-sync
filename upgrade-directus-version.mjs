#!/usr/bin/env zx

const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replacement) {
  const fileContent = readFileSync(filePath, 'utf8');
  const newFileContent = fileContent.replace(search, replacement);
  writeFileSync(filePath, newFileContent);
}

const next = process.argv[3];

if (!next) {
  console.error('Usage: upgrade-directus <version>');
  process.exit(1);
}

// Get actual version from packages/e2e/package.json
const packagePath = path.resolve(__dirname, 'packages/e2e/package.json');
const actual = JSON.parse(readFileSync(packagePath, 'utf8')).devDependencies
  .directus;

console.log(chalk.magenta(`Upgrading Directus from ${actual} to ${next}`));

// Ensure we starts on the main branch
console.log(chalk.yellow(`Checking out main branch`));
await $`git checkout .`;
await $`git checkout main`;
await $`git pull`;

// Update packages
console.log(chalk.yellow(`Updating packages`));
await $`npm install`;

// Find the line "const next = 'x.x.x';" in file packages/e2e/upgrade-directus-version.mjs and replace it with the new version
console.log(
  chalk.yellow(`Updating version in packages/e2e/upgrade-directus-version.mjs`),
);
replaceInFile(
  path.resolve(__dirname, 'packages/e2e/upgrade-directus-version.mjs'),
  `const next = '${actual}';`,
  `const next = '${next}';`,
);

// Run the upgrade script
console.log(chalk.yellow(`Running the upgrade script`));
await $`cd packages/e2e && npm run upgrade`;

// Run the format script
console.log(chalk.yellow(`Running the format script`));
await $`npm run format`;

// Ignore changes in packages/e2e/dumps/sources/group-and-field-names-conflict
console.log(
  chalk.yellow(
    `Ignoring changes in packages/e2e/dumps/sources/group-and-field-names-conflict`,
  ),
);
await $`git checkout packages/e2e/dumps/sources/group-and-field-names-conflict/snapshot/fields`;
await $`git checkout packages/e2e/dumps/sources/group-and-field-names-conflict/snapshot/collections`;
await $`git checkout packages/e2e/dumps/sources/group-and-field-names-conflict/collections`;

// Test the upgrade
console.log(chalk.yellow(`Testing the upgrade`));
console.log(chalk.blue(`Installing dependencies`));
await $`npm install`;
console.log(chalk.blue(`Building the project`));
await $`npm run build`;
console.log(chalk.blue(`Running the tests`));
await $`npm run test`;

// Change version in other files
console.log(chalk.yellow(`Changing version in other files`));
replaceInFile(
  path.resolve(__dirname, 'README.md'),
  `Directus ${actual}`,
  `Directus ${next}`,
);
replaceInFile(
  path.resolve(__dirname, 'README.md'),
  `Directus-${actual}`,
  `Directus-${next}`,
);
replaceInFile(
  path.resolve(__dirname, 'website/docs/intro.md'),
  `Directus ${actual}`,
  `Directus ${next}`,
);
replaceInFile(
  path.resolve(__dirname, 'website/docs/intro.md'),
  `Directus-${actual}`,
  `Directus-${next}`,
);
replaceInFile(
  path.resolve(__dirname, 'packages/e2e/upgrade-directus-version.mjs'),
  `const actual = '${actual}';`,
  `const actual = '${next}';`,
);
replaceInFile(
  path.resolve(__dirname, 'docker/build-and-push.mjs'),
  `const latestDirectusVersion = '${actual}';`,
  `const latestDirectusVersion = '${next}';`,
);
replaceInFile(
  path.resolve(__dirname, 'website/docs/getting-started/installation.md'),
  `FROM directus/directus:${actual}`,
  `FROM directus/directus:${next}`,
);

// Commit the changes
console.log(chalk.yellow(`Committing the changes`));
const answer = (
  await question(`Are you sure you want to commit and push the changes? (yes/no)`)
)
  .trim()
  .toLowerCase();
if (answer !== 'yes' && answer !== 'y') {
  console.log(chalk.red(`Aborting`));
  process.exit(1);
}
await $`git add -A`;
await $`git commit -m "chore: directus ${next} compatibility"`;
await $`git push`;

// Push the new Docker images
console.log(chalk.yellow(`Pushing the new Docker images`));
await $`cd docker && ./build-and-push.mjs`;

// Finish
console.log(chalk.green(`Done!`));
