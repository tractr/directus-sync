import {
  DirectusClient,
  PermissionAction,
  PermissionWithSystem,
  SystemCollection,
} from '../sdk/index.js';
import { createPermission, createRole, readPermissions } from '@directus/sdk';
import { getPermission, getRole } from '../seed/index.js';

export async function newPermission(
  client: DirectusClient['client'],
  role: string | null,
  collection: SystemCollection,
  action: PermissionAction,
) {
  return await client.request(
    createPermission(getPermission(role, collection, action)),
  );
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
