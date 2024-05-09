#!/usr/bin/env zx

const directusVersions = [
  'latest',

  '10',

  '10.9',
  '10.9.0',
  '10.9.1',
  '10.9.2',
  '10.9.3',

  '10.10',
  '10.10.0',
  '10.10.1',
  '10.10.2',
  '10.10.3',
  '10.10.4',
  '10.10.5',
  '10.10.6',
  '10.10.7',

  '10.11',
  '10.11.0',
];

const platforms = ['linux/amd64', 'linux/arm64'];

for (const version of directusVersions) {
  console.log(
    chalk.magenta(
      `============== tractr/directus-sync:${version} ==============`,
    ),
  );
  await $`docker buildx build \
    --tag tractr/directus-sync:${version} \
    --build-arg DIRECTUS_VERSION=${version} \
    --push \
    --platform ${platforms.join(',')} \
    .`;
  console.log(
    chalk.green(
      `==> tractr/directus-sync:${version} has been built and pushed`,
    ),
  );
}
