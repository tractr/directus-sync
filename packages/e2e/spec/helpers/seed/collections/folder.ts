import { faker } from '@faker-js/faker';
import { DirectusFolder } from '@directus/sdk';
import { Schema } from '../../sdk/index.js';

export function getFolder(parent?: string): Omit<DirectusFolder<Schema>, 'id'> {
  return {
    name: faker.lorem.words({ min: 1, max: 2 }),
    parent: parent ?? null,
  };
}
