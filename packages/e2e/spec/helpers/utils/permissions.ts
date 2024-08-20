import {
  DirectusClient,
  PermissionAction,
  PermissionWithSystem,
  SystemCollection,
} from '../sdk/index.js';
import {
  createPermission,
  createPolicy,
  createRole,
  readPermissions,
} from '@directus/sdk';
import { getPermission, getPolicy, getRole } from '../seed/index.js';

export async function newPermission(
  client: DirectusClient['client'],
  policy: string,
  collection: SystemCollection,
  action: PermissionAction,
) {
  return await client.request(
    createPermission(getPermission(policy, collection, action)),
  );
}

export async function newPolicy(
  client: DirectusClient['client'],
  role: string | null,
) {
  return await client.request(createPolicy(getPolicy(role)));
}

export async function newRole(client: DirectusClient['client']) {
  return await client.request(createRole(getRole()));
}

export async function readNonSystemPermissions(
  client: DirectusClient['client'],
) {
  return (
    await client.request<PermissionWithSystem[]>(
      readPermissions({
        fields: ['id', 'role', 'collection', 'action'],
      }),
    )
  ).filter((p) => !p.system);
}
