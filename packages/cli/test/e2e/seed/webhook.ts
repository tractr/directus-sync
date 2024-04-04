import { DirectusWebhook } from '@directus/sdk';
import { faker } from '@faker-js/faker';
import { getAction, getStatus } from './helpers';

export function getWebhook(): Omit<DirectusWebhook<object>, 'id'> {
  return {
    name: faker.lorem.words({ min: 1, max: 2 }),
    method: faker.helpers.arrayElement(['GET', 'POST']),
    url: faker.internet.url(),
    status: getStatus(),
    data: faker.datatype.boolean(),
    actions: [getAction()],
    collections: ['directus_sync_id_map'],
    headers: [
      {
        header: `X-${faker.lorem.slug()}`,
        value: faker.string.alphanumeric(32),
      },
    ],
  };
}
