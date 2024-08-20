import { faker } from '@faker-js/faker';
import { getIcon } from '../helpers/index.js';
import { DirectusPolicy } from '../../sdk/index.js';

export function getPolicy(
  role: string | null,
): Partial<Omit<DirectusPolicy<object>, 'id'>> {
  return {
    name: faker.lorem.words({ min: 1, max: 2 }),
    icon: getIcon(),
    description: faker.lorem.sentence({ min: 10, max: 20 }),
    ip_access: [faker.internet.ipv4(), faker.internet.ipv4()] as never, // Fix wrong type from Directus SDK
    enforce_tfa: faker.datatype.boolean(),
    admin_access: false,
    app_access: faker.datatype.boolean(),
    roles: role ? [role] : [],
  };
}
