import { z } from 'zod';

export const OptionsFields = {
  // Global
  configPath: z.string(),
  debug: z.boolean(),
  directusUrl: z.string(),
  directusToken: z.string(),
  // Pull, diff, push
  split: z.boolean(),
  dumpPath: z.string(),
  collectionsPath: z.string(),
  snapshotPath: z.string(),
  // Diff, push
  force: z.boolean(),
  // Untrack
  collection: z.string().optional(),
  id: z.string().optional(),
};
export const OptionsSchema = z.object(OptionsFields);

export const ConfigFileOptionsSchema = z.object({
  // Inheritance
  extends: z.array(z.string()).optional(),
  // Global options
  debug: OptionsFields.debug.optional(),
  directusUrl: OptionsFields.directusUrl.optional(),
  directusToken: OptionsFields.directusToken.optional(),
  // Dump config
  split: OptionsFields.split.optional(),
  dumpPath: OptionsFields.dumpPath.optional(),
  collectionsPath: OptionsFields.collectionsPath.optional(),
  snapshotPath: OptionsFields.snapshotPath.optional(),
});
