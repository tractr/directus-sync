import { DirectusClient, PermissionAction, SystemCollection } from '../sdk/index.js';
import { createPermission, createRole } from '@directus/sdk';
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
