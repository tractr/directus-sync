import { faker } from '@faker-js/faker';
import { DirectusFolder } from '@directus/sdk';

export function getFolder(parent?: string): Omit<DirectusFolder<object>, 'id'> {
  return {
    name: faker.lorem.words({ min: 1, max: 2 }),
    parent: parent ?? null,
  };
}
