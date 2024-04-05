import { faker } from '@faker-js/faker';
import { getIcon } from '../helpers';
import { DirectusPanel } from '@directus/sdk';

export function getPanel(
  dashboard: string,
): Omit<DirectusPanel<object>, 'id' | 'date_created' | 'user_created'> {
  const type = faker.helpers.arrayElement(['metric', 'label'] as const);
  const options =
    type === 'metric'
      ? {
          collection: 'directus_users',
          field: 'email',
          function: 'count',
          sortField: 'email_notifications',
          filter: {
            _and: [
              {
                first_name: {
                  _contains: faker.lorem.word(),
                },
              },
            ],
          },
          prefix: faker.lorem.word(),
          suffix: faker.lorem.word(),
          minimumFractionDigits: 1,
        }
      : {
          text: faker.lorem.sentence({ min: 10, max: 20 }),
          whiteSpace: 'pre-wrap',
          color: faker.color.rgb({ casing: 'upper' }),
          textAlign: 'left',
          fontWeight: 300,
          fontStyle: 'oblique',
          fontSize: '32px',
          font: 'serif',
        };

  return {
    dashboard: dashboard,
    name: faker.lorem.words({ min: 1, max: 2 }),
    icon: getIcon(),
    color: faker.color.rgb({ casing: 'upper' }),
    show_header: faker.datatype.boolean(),
    note: faker.lorem.sentence({ min: 10, max: 20 }),
    type: type,
    position_x: faker.number.int({ min: 1, max: 20 }),
    position_y: faker.number.int({ min: 1, max: 20 }),
    width: faker.number.int({ min: 20, max: 50 }),
    height: faker.number.int({ min: 20, max: 50 }),
    options: options,
  };
}
