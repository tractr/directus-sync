import { faker } from '@faker-js/faker';
import { getIcon } from '../helpers';
import { DirectusPreset } from '@directus/sdk';

export function getPreset(
  role?: string,
  user?: string,
): Omit<DirectusPreset<object>, 'id'> {
  return {
    bookmark: faker.lorem.word(),
    role: role ?? null,
    user: user ?? null,
    collection: `directus_users`,
    search: faker.lorem.word(),
    layout: 'tabular',
    layout_query: {
      cards: {
        sort: ['email'],
      },
      tabular: {
        fields: ['email', 'first_name', 'last_name', 'password'],
      },
    },
    layout_options: {
      cards: {
        icon: 'account_circle',
        title: '{{ first_name }} {{ last_name }}',
        subtitle: '{{ email }}',
        size: 3,
      },
      tabular: {
        widths: {
          email: 266,
        },
      },
    },
    refresh_interval: faker.number.int({ min: 5000, max: 50000 }),
    filter: {
      _and: [
        {
          email: {
            _eq: faker.internet.email(),
          },
        },
      ],
    },
    icon: getIcon(),
    color: faker.color.rgb({ casing: 'upper' }),
  };
}
