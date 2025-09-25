#!/usr/bin/env zx

const latestDirectusVersion = '11.10.1';
const [major, minor, patch] = latestDirectusVersion.split('.');
const directusVersions = [
  'latest',
  `${major}`,
  `${major}.${minor}`,
  `${major}.${minor}.${patch}`,
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
