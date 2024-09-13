#!/usr/bin/env bash

set -e

# Ensure we are on the main branch
git checkout main
git pull

npm install
npm run format
npm run lint
npm run build
npm run bootstrap
npm run test

# Ask confirmation before creating a new version
read -p "Do you want to create a new version? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

# Create a new version
npm run lerna version

# Ask confirmation before publishing
read -p "Do you want to publish the new version? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

# Publish the new version
npm run lerna publish from-package

