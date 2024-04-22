import { faker } from '@faker-js/faker';

const ACTIONS = ['create', 'update', 'delete'] as const;

export function getAction() {
  return faker.helpers.arrayElement(ACTIONS);
}
