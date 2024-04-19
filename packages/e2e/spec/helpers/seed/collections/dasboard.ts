import { faker } from '@faker-js/faker';
import { getIcon } from '../helpers/index.js';
import { DirectusDashboard } from '@directus/sdk';

export function getDashboard(): Omit<
  DirectusDashboard<object>,
  'id' | 'date_created' | 'user_created'
> {
  return {
    name: faker.lorem.words({ min: 1, max: 2 }),
    icon: getIcon(),
    note: faker.lorem.sentence({ min: 10, max: 20 }),
    color: faker.color.rgb({ casing: 'upper' }),
  };
}
