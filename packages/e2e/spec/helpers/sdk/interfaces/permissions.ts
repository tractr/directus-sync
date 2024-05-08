import { DirectusPermission } from '@directus/sdk';

export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'share';

export type PermissionWithSystem = DirectusPermission<object> & {
  system: boolean;
};
