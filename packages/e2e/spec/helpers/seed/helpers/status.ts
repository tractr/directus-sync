import { faker } from '@faker-js/faker';

const STATUSES = ['active', 'inactive'] as const;

export function getStatus() {
  return faker.helpers.arrayElement(STATUSES);
}
