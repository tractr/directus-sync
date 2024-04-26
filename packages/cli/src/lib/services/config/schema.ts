import { z } from 'zod';

export const CollectionsList = [
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
] as const;

export const CollectionEnum = z.enum(CollectionsList);

export const HooksSchema = z.object({
  onLoad: z.function().optional(),
  onDump: z.function().optional(),
  onSave: z.function().optional(),
  onQuery: z.function().optional(),
});
export const OptionsHooksSchema = z.object({
  dashboards: HooksSchema.optional(),
  flows: HooksSchema.optional(),
  folders: HooksSchema.optional(),
  operations: HooksSchema.optional(),
  panels: HooksSchema.optional(),
  permissions: HooksSchema.optional(),
  presets: HooksSchema.optional(),
  roles: HooksSchema.optional(),
  settings: HooksSchema.optional(),
  translations: HooksSchema.optional(),
  webhooks: HooksSchema.optional(),
} satisfies { [key in z.infer<typeof CollectionEnum>]: z.Schema });

export const OptionsFields = {
  // Global
  configPath: z.string().optional(),
  debug: z.boolean(),
  directusUrl: z.string(),
  directusToken: z.string().optional(),
  directusEmail: z.string().optional(),
  directusPassword: z.string().optional(),
  // Pull, diff, push
  dumpPath: z.string(),
  // Collections
  collectionsPath: z.string(),
  excludeCollections: z.array(CollectionEnum).optional(),
  onlyCollections: z.array(CollectionEnum).optional(),
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
  // Hooks
  hooks: OptionsHooksSchema.optional(),
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
  // Dump config
  dumpPath: OptionsFields.dumpPath.optional(),
  // Collections config
  collectionsPath: OptionsFields.collectionsPath.optional(),
  excludeCollections: OptionsFields.excludeCollections.optional(),
  onlyCollections: OptionsFields.onlyCollections.optional(),
  // Snapshot config
  snapshotPath: OptionsFields.snapshotPath.optional(),
  snapshot: OptionsFields.snapshot.optional(),
  split: OptionsFields.split.optional(),
  // Specifications config
  specsPath: OptionsFields.specsPath.optional(),
  specs: OptionsFields.specs.optional(),
  // Hooks config
  hooks: OptionsHooksSchema.optional(),
});
