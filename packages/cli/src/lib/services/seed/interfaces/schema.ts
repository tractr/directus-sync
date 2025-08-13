import { z } from 'zod';

export const SeedSchema = z
  .object({
    collection: z.string(),
    meta: z
      .object({
        insert_order: z.number().optional(),
        create: z.boolean().default(true),
        update: z.boolean().default(true),
        delete: z.boolean().default(true),
        preserve_ids: z.boolean().default(false),
        ignore_on_update: z.array(z.string()).default([]),
      })
      .default({
        create: true,
        update: true,
        delete: true,
        preserve_ids: false,
        ignore_on_update: [],
      }),
    data: z.array(
      z
        .object({
          _sync_id: z.string(),
          _file_path: z.string().optional(),
        })
        .passthrough(),
    ),
  })
  // Check if file path is provided for directus_files
  .superRefine((data, ctx) => {
    if (data.collection === 'directus_files') {
      const isMissingFilePath = data.data.some((item) => !item._file_path);
      if (isMissingFilePath) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'File path is required for directus_files',
        });
      }
    }
  });

export const SeedsFileSchema = SeedSchema.array().or(
  SeedSchema.transform((data) => [data]),
);
