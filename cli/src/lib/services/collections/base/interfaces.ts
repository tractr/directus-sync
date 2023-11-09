export type DirectusId = number | string;
export type DirectusBaseType = {
  id: DirectusId;
};
export type WithSyncId<T> = T & {
  _syncId: string;
};
export type WithoutId<T> = Omit<T, 'id'>;
export type WithoutSyncId<T> = Omit<T, '_syncId'>;
export type WithoutIdAndSyncId<T> = Omit<T, 'id' | '_syncId'>;
export type WithSyncIdAndWithoutId<T> = WithSyncId<WithoutId<T>>;
export type UpdateItem<T> = {
  sourceItem: WithSyncIdAndWithoutId<T>;
  targetItem: WithSyncId<T>;
  diffItem: Partial<WithoutIdAndSyncId<T>>;
};
