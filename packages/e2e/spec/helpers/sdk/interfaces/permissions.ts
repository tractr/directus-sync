import { DirectusPermission } from '@directus/sdk';

// TODO: remove this once it is fixed in the SDK
export type FixPermission<T> = Omit<T, 'role'> & {
  policy: string | null;
};

export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'share';

export type PermissionWithSystem = FixPermission<DirectusPermission<object>> & {
  system: boolean;
};
