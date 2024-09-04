import { faker } from '@faker-js/faker';
import { DirectusTranslation } from '@directus/sdk';
import { getLanguage } from '../helpers/index.js';
import { Schema } from '../../sdk/index.js';

export function getTranslation(): Omit<DirectusTranslation<Schema>, 'id'> {
  return {
    language: getLanguage(),
    key: faker.lorem.slug({ min: 1, max: 3 }),
    value: faker.lorem.words({ min: 1, max: 6 }),
  };
}
