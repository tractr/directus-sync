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
} satisfies { [key in z.infer<typeof CollectionEnum>]: z.Schema; });


export const OptionsFields = {
  // Global
  configPath: z.string().optional(),
  debug: z.boolean(),
  directusUrl: z.string(),
  directusToken: z.string().optional(),
  directusEmail: z.string().optional(),
  directusPassword: z.string().optional(),
  // Pull, diff, push
  split: z.boolean(),
  dumpPath: z.string(),
  collectionsPath: z.string(),
  snapshotPath: z.string(),
  // Specifications
  specs: z.boolean(),
  specsPath: z.string(),
  // Diff, push
  force: z.boolean(),
  // Untrack
  collection: z.string().optional(),
  id: z.string().optional(),
  // Hooks
  hooks: OptionsHooksSchema.optional(),
  // Exclusion and Inclusion
  excludeCollections: z.array(CollectionEnum).optional(),
  onlyCollections: z.array(CollectionEnum).optional(),
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
  split: OptionsFields.split.optional(),
  dumpPath: OptionsFields.dumpPath.optional(),
  collectionsPath: OptionsFields.collectionsPath.optional(),
  snapshotPath: OptionsFields.snapshotPath.optional(),
  // Specifications config
  specs: OptionsFields.specs.optional(),
  specsPath: OptionsFields.specsPath.optional(),
  // Hooks config
  hooks: OptionsHooksSchema.optional(),
  // Exclusion and Inclusion
  excludeCollections: OptionsFields.excludeCollections.optional(),
  onlyCollections: OptionsFields.onlyCollections.optional(),
});
