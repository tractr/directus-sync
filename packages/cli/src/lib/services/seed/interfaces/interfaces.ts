import { SeedSchema } from './schema';
import { z } from 'zod';

export type Seed = z.infer<typeof SeedSchema>;

export type SeedMeta = Required<Seed>['meta'];

export type SeedData = Seed['data'];
