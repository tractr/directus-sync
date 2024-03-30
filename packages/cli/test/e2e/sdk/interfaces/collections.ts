export type DumpedCollection =
  | 'dashboards'
  | 'flows'
  | 'folders'
  | 'operations'
  | 'panels'
  | 'permissions'
  | 'presets'
  | 'roles'
  | 'settings'
  | 'translations'
  | 'webhooks';

export type CollectionsRecord<T> = {
  [key in DumpedCollection]?: T;
};
