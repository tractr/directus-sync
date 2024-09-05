import {
  FixPermission,
  PermissionAction,
  Schema,
  SystemCollection,
} from '../../sdk/index.js';
import { faker } from '@faker-js/faker';
import { DirectusPermission } from '@directus/sdk';

export function getPermission(
  policy: string,
  collection: SystemCollection,
  action: PermissionAction,
): Omit<FixPermission<DirectusPermission<Schema>>, 'id'> {
  const dummyPermission = {
    id: {
      _eq: '$CURRENT_USER',
    },
  };
  const dummyPreset = {
    user_agent: 'unknown',
  };
  const dummyValidation = {
    _and: [
      {
        timestamp: {
          _lt: '2024-04-02T12:00:00-04:00',
        },
      },
    ],
  };

  const permissions =
    action === 'create'
      ? {}
      : faker.helpers.arrayElement([{}, dummyPermission] as const);

  return {
    policy,
    collection: `directus_${collection}`,
    action: action,
    permissions: permissions,
    validation: faker.helpers.arrayElement([null, dummyValidation] as const),
    presets: faker.helpers.arrayElement([null, dummyPreset] as const),
    fields: faker.helpers.arrayElement([['id'], ['*']] as const),
  };
}
