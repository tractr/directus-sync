#!/usr/bin/env zx

// Ensure we are on the main branch
await $`git checkout main`;
await $`git pull`;

await $`npm install`;
await $`npm run format`;
await $`npm run lint`;
await $`npm run build`;
await $`npm run bootstrap`;
await $`npm run test`;

// Ask confirmation before creating a new version
const createVersion = await question(
  'Do you want to create a new version? (y/n) ',
);
if (!createVersion.toLowerCase().startsWith('y')) {
  process.exit(1);
}

// Create a new version
await $`npm run lerna version`;

// Ask confirmation before publishing
const publish = await question(
  'Do you want to publish the new version? (y/n) ',
);
if (!publish.toLowerCase().startsWith('y')) {
  process.exit(1);
}

// Publish the new version
await $`npm run lerna publish from-package`;
