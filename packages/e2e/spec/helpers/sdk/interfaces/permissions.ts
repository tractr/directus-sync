import { DirectusPermission as BaseDirectusPermission } from '@directus/sdk';

// TODO: remove this once it is fixed in the SDK
export type DirectusPermission<T> = Omit<BaseDirectusPermission<T>, 'role'> & {
  policy: string | null;
};
export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'share';

export type PermissionWithSystem = DirectusPermission<object> & {
  system: boolean;
};
