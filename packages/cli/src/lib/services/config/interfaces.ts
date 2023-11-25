import { z } from 'zod';
import {
  ConfigFileOptionsSchema,
  OptionsFields,
  OptionsSchema,
} from './schema';

export type OptionName = keyof typeof OptionsFields;

export type Options = z.infer<typeof OptionsSchema>;

export type ConfigFileOptions = z.infer<typeof ConfigFileOptionsSchema>;
