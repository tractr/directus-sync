import {
  DirectusClient,
  PermissionAction,
  PermissionWithSystem,
  Schema,
  SystemCollection,
} from '../sdk/index.js';
import {
  createPermission,
  createPolicy,
  createRole,
  DirectusPermission,
  DirectusPolicy,
  Query,
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
  return await client.request(
    // Todo: remove this once it is fixed in the SDK
    createPolicy(getPolicy(role) as unknown as DirectusPolicy<Schema>),
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
        fields: ['id', 'policy', 'collection', 'action'],
        // Todo: remove this once it is fixed in the SDK
      } as Query<Schema, DirectusPermission<Schema>>),
    )
  ).filter((p) => !p.system);
}
