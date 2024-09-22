import { ValueOf } from 'ts-essentials';
import {
  DirectusDashboard,
  DirectusFlow,
  DirectusFolder,
  DirectusOperation,
  DirectusPanel,
  DirectusPermission,
  DirectusPolicy,
  DirectusPreset,
  DirectusRole,
  DirectusSettings,
  DirectusTranslation,
} from '@directus/sdk';
import { FixPolicy } from './policy';
import { FixPermission } from './permissions';
import { FixSettings } from './settings';

export type DirectusId = number | string;
export type Schema = object;

export type SystemCollectionsNames = [
  'dashboards',
  'flows',
  'folders',
  'operations',
  'panels',
  'permissions',
  'policies',
  'presets',
  'roles',
  'settings',
  'translations',
];
export interface SystemCollectionsTypes {
  dashboards: DirectusDashboard<Schema>;
  flows: DirectusFlow<Schema>;
  folders: DirectusFolder<Schema>;
  operations: DirectusOperation<Schema>;
  panels: DirectusPanel<Schema>;
  permissions: FixPermission<DirectusPermission<Schema>>;
  policies: FixPolicy<DirectusPolicy<Schema>>;
  presets: DirectusPreset<Schema>;
  roles: DirectusRole<Schema>;
  settings: FixSettings<DirectusSettings<Schema>>;
  translations: DirectusTranslation<Schema>;
}

export type SystemCollection = ValueOf<SystemCollectionsNames>;

export type SystemCollectionsRecord<T> = {
  [key in SystemCollection]: T;
};
export type SystemCollectionsRecordPartial<T> = {
  [key in SystemCollection]?: T;
};

export type SystemCollectionsPartial = {
  [key in SystemCollection]?: Partial<SystemCollectionsTypes[key]>;
};

export type SystemCollectionsContent<Extra = void> = {
  [key in SystemCollection]: (Extra &
    Partial<SystemCollectionsTypes[key]> &
    Record<string, unknown>)[];
};
export type SystemCollectionsContentWithSyncId = SystemCollectionsContent<{
  _syncId: string;
}>;
