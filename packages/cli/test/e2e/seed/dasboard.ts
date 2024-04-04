import { faker } from '@faker-js/faker';
import { getIcon } from './icon';
import { DirectusDashboard } from '@directus/sdk';

export function getDashboard(): Omit<
  DirectusDashboard<object>,
  'id' | 'date_created' | 'user_created'
> {
  return {
    name: faker.lorem.sentence({ min: 1, max: 2 }),
    icon: getIcon(),
    note: faker.lorem.sentence({ min: 3, max: 5 }),
    color: faker.color.rgb({ casing: 'upper' }),
  };
}
