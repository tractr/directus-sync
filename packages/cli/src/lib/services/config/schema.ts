import { z } from 'zod';

export const Options = {
  debug: z.boolean(),
  directusUrl: z.string(),
  directusToken: z.string(),
  split: z.boolean(),
  dumpPath: z.string(),
  collectionsPath: z.string(),
  snapshotPath: z.string(),
  force: z.boolean(),
  collection: z.string(),
  id: z.string(),
};
export const OptionsSchema = z.object(Options);

export const ProgramOptionsSchema = z.object({
  debug: Options.debug,
  directusUrl: Options.directusUrl,
  directusToken: Options.directusToken,
});

export const CommandsOptionsSchemas = {
  pull: z.object({
    split: Options.split,
    dumpPath: Options.dumpPath,
    collectionsPath: Options.collectionsPath,
    snapshotPath: Options.snapshotPath,
  }),
  diff: z.object({
    split: Options.split,
    dumpPath: Options.dumpPath,
    collectionsPath: Options.collectionsPath,
    snapshotPath: Options.snapshotPath,
    force: Options.force,
  }),
  push: z.object({
    split: Options.split,
    dumpPath: Options.dumpPath,
    collectionsPath: Options.collectionsPath,
    snapshotPath: Options.snapshotPath,
    force: Options.force,
  }),
  untrack: z.object({
    collection: Options.collection,
    id: Options.id,
  }),
};
