export type DirectusId = number | string;
export type DirectusBaseType = {
  id: DirectusId;
};
export type WithSyncId<T extends DirectusBaseType> = T & {
  _syncId: string;
};
export type WithoutId<T extends DirectusBaseType> = Omit<T, 'id' | '_syncId'>;
export type UpdateItem<T extends DirectusBaseType> = {
  sourceItem: WithSyncId<T>;
  targetItem: WithSyncId<T>;
  diffItem: Partial<WithoutId<T>>;
};
