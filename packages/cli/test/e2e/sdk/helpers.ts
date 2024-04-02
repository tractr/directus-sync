import { DirectusPermission, DirectusRole } from '@directus/sdk';

export function notSystemPermissions(permission: DirectusPermission<object> & { system?: boolean}): permission is DirectusPermission<object>{
  return !permission.system
}

export function notAdministratorRoles(role: DirectusRole<object>): boolean {
  return role.name !== 'Administrator' && !role.admin_access;
}

export function notNullId<T extends { id: string | number | null }>(item: T): item is T {
  return item.id !== null;
}