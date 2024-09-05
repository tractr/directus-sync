import { faker } from '@faker-js/faker';
import { DirectusRole } from '@directus/sdk';
import { getIcon } from '../helpers/index.js';
import { Schema } from '../../sdk/index.js';

export function getRole(
  parent?: string,
): Partial<Omit<DirectusRole<Schema>, 'id'>> {
  return {
    name: faker.lorem.words({ min: 1, max: 2 }),
    icon: getIcon(),
    description: faker.lorem.sentence({ min: 10, max: 20 }),
    ...(parent ? { parent } : {}),
  };
}
