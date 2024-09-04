import { faker } from '@faker-js/faker';
import { getIcon } from '../helpers/index.js';
import { DirectusDashboard } from '@directus/sdk';
import { Schema } from '../../sdk/index.js';

export function getDashboard(): Omit<
  DirectusDashboard<Schema>,
  'id' | 'date_created' | 'user_created'
> {
  return {
    name: faker.lorem.words({ min: 1, max: 2 }),
    icon: getIcon(),
    note: faker.lorem.sentence({ min: 10, max: 20 }),
    color: faker.color.rgb({ casing: 'upper' }),
  };
}
