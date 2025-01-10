import { z } from 'zod';

export const SeedSchema = z.object({
  collection: z.string(),
  meta: z
    .object({
      insert_order: z.number().optional(),
      create: z.boolean().default(true),
      update: z.boolean().default(true),
      delete: z.boolean().default(true),
      preserve_ids: z.boolean().default(false),
    })
    .default({
      create: true,
      update: true,
      delete: true,
      preserve_ids: false,
    }),
  data: z.array(
    z.object({
      _sync_id: z.string(),
    }),
  ),
});

export const SeedsFileSchema = SeedSchema.array().or(
  SeedSchema.transform((data) => [data]),
);
