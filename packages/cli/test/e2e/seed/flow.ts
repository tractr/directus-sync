import { faker } from '@faker-js/faker';
import { getIcon } from './icon';
import { DirectusFlow } from '@directus/sdk';

export function getFlow(
  operation?: string,
): Omit<DirectusFlow<object>, 'id' | 'date_created' | 'user_created'> {
  const trigger = faker.helpers.arrayElement(['schedule', 'webhook'] as const);
  const options =
    trigger === 'schedule'
      ? { cron: '0 0 * * *' }
      : {
          method: 'POST',
          return: '$all',
        };

  return {
    name: faker.lorem.sentence({ min: 1, max: 2 }),
    icon: getIcon(),
    color: faker.color.rgb({ casing: 'upper' }),
    description: faker.lorem.sentence({ min: 3, max: 5 }),
    status: faker.helpers.arrayElement(['active', 'inactive'] as const),
    trigger: trigger,
    accountability: faker.helpers.arrayElement([
      'all',
      'activity',
      null,
    ] as const),
    options: options,
    operation: operation ?? null,
  };
}
