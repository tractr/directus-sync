import { faker } from '@faker-js/faker';
import { DirectusOperation } from '@directus/sdk';
import { Schema } from '../../sdk/index.js';

export function getOperation(
  flow: string,
  resolve?: string,
  reject?: string,
): Omit<
  DirectusOperation<Schema>,
  'id' | 'date_created' | 'user_created' | 'timestamp'
> {
  const type = faker.helpers.arrayElement(['exec', 'log'] as const);
  const options =
    type === 'exec'
      ? {
          code: 'module.exports = async function(data) {\n\treturn { test: true, ...data };\n}',
        }
      : {};

  return {
    name: faker.lorem.words({ min: 1, max: 2 }),
    key: faker.lorem.slug(2),
    type: type,
    position_x: faker.number.int({ min: 20, max: 100 }),
    position_y: faker.number.int({ min: 1, max: 20 }),
    options: options,
    resolve: resolve ?? null,
    reject: reject ?? null,
    flow: flow,
  };
}
