import { z } from 'zod';

export const CollectionsList = [
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
] as const;

export const CollectionsWithUuidList = [
  'dashboards',
  'flows',
  'folders',
  'operations',
  'panels',
  'policies',
  'roles',
  'translations',
] as const;

export const CollectionsWithPreservedIdList = ['flows', 'folders'] as const;

export const CollectionEnum = z.enum(CollectionsList);
export const CollectionWithUuidEnum = z.enum(CollectionsWithUuidList);
export const CollectionPreservableIdEnum = CollectionWithUuidEnum.exclude(
  CollectionsWithPreservedIdList,
);

export const CollectionHooksSchema = z.object({
  onLoad: z.function().optional(),
  onDump: z.function().optional(),
  onSave: z.function().optional(),
  onQuery: z.function().optional(),
});
export const SnapshotHooksSchema = z.object({
  onLoad: z.function().optional(),
  onSave: z.function().optional(),
});
export const OptionsHooksSchema = z.object({
  dashboards: CollectionHooksSchema.optional(),
  flows: CollectionHooksSchema.optional(),
  folders: CollectionHooksSchema.optional(),
  operations: CollectionHooksSchema.optional(),
  panels: CollectionHooksSchema.optional(),
  permissions: CollectionHooksSchema.optional(),
  policies: CollectionHooksSchema.optional(),
  presets: CollectionHooksSchema.optional(),
  roles: CollectionHooksSchema.optional(),
  settings: CollectionHooksSchema.optional(),
  translations: CollectionHooksSchema.optional(),
  snapshot: SnapshotHooksSchema.optional(),
} satisfies { [key in z.infer<typeof CollectionEnum> | 'snapshot']: z.Schema });

export const ClientConfigSchema = z.object({
  globals: z
    .object({
      URL: z.instanceof(URL).optional(),
      WebSocket: z.function().optional(),
      fetch: z.function().returns(z.instanceof(Promise)).optional(),
      logger: z
        .object({
          log: z.function(),
          info: z.function(),
          warn: z.function(),
          error: z.function(),
        })
        .optional(),
    })
    .optional(),
});

export const RestConfigSchema = z.object({
  credentials: z.string().optional(),
  onRequest: z.function().optional(),
  onResponse: z.function().optional(),
});

export const OptionsFields = {
  // Global
  configPath: z.string().optional(),
  debug: z.boolean(),
  directusUrl: z.string(),
  directusToken: z.string().optional(),
  directusEmail: z.string().optional(),
  directusPassword: z.string().optional(),
  directusConfig: z
    .object({
      clientOptions: ClientConfigSchema.optional(),
      restConfig: RestConfigSchema.optional(),
    })
    .optional(),
  // Pull, diff, push
  dumpPath: z.string(),
  // Collections
  collectionsPath: z.string(),
  excludeCollections: z.array(CollectionEnum).optional(),
  onlyCollections: z.array(CollectionEnum).optional(),
  preserveIds: z.union([
    z.array(CollectionPreservableIdEnum).optional(),
    z.enum(['all', '*']),
  ]),
  // Snapshot
  snapshotPath: z.string(),
  snapshot: z.boolean(),
  split: z.boolean(),
  // Specifications
  specsPath: z.string(),
  specs: z.boolean(),
  // Diff, push
  force: z.boolean(),
  // Untrack
  collection: z.string().optional(),
  id: z.string().optional(),
  // Remove Permission Duplicates
  keep: z.enum(['first', 'last']).optional(),
  // Hooks
  hooks: OptionsHooksSchema.optional(),
  // Seed
  seedPath: z.string().or(z.array(z.string())).optional(),
};
export const OptionsSchema = z.object(OptionsFields);

export const ConfigFileOptionsSchema = z.object({
  // Inheritance
  extends: z.array(z.string()).optional(),
  // Global options
  debug: OptionsFields.debug.optional(),
  directusUrl: OptionsFields.directusUrl.optional(),
  directusToken: OptionsFields.directusToken.optional(),
  directusEmail: OptionsFields.directusEmail.optional(),
  directusPassword: OptionsFields.directusPassword.optional(),
  directusConfig: z
    .object({
      clientOptions: ClientConfigSchema.optional(),
      restConfig: RestConfigSchema.optional(),
    })
    .optional(),
  // Dump config
  dumpPath: OptionsFields.dumpPath.optional(),
  // Collections config
  collectionsPath: OptionsFields.collectionsPath.optional(),
  excludeCollections: OptionsFields.excludeCollections.optional(),
  onlyCollections: OptionsFields.onlyCollections.optional(),
  preserveIds: OptionsFields.preserveIds.optional(),
  // Snapshot config
  snapshotPath: OptionsFields.snapshotPath.optional(),
  snapshot: OptionsFields.snapshot.optional(),
  split: OptionsFields.split.optional(),
  // Specifications config
  specsPath: OptionsFields.specsPath.optional(),
  specs: OptionsFields.specs.optional(),
  // Hooks config
  hooks: OptionsHooksSchema.optional(),
  // Seed config
  seedPath: OptionsFields.seedPath.optional(),
});
