import { ValueOf } from 'ts-essentials';

export type SystemCollectionsNames = [
  'dashboards',
  'flows',
  'folders',
  'operations',
  'panels',
  'permissions',
  'presets',
  'roles',
  'settings',
  'translations',
  'webhooks',
];
export type SystemCollection = ValueOf<SystemCollectionsNames>;

export type SystemCollectionsRecord<T> = {
  [key in SystemCollection]: T;
};
