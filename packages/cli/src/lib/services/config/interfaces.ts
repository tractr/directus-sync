import { z } from 'zod';
import {
  CommandsOptionsSchemas,
  ConfigFileOptionsSchema,
  Options,
  OptionsSchema,
  ProgramOptionsSchema,
} from './schema';

export type ProgramOptions = z.infer<typeof ProgramOptionsSchema>;

export interface CommandsOptions {
  pull: z.infer<typeof CommandsOptionsSchemas.pull>;
  diff: z.infer<typeof CommandsOptionsSchemas.diff>;
  push: z.infer<typeof CommandsOptionsSchemas.push>;
  untrack: z.infer<typeof CommandsOptionsSchemas.untrack>;
}

export type CommandName = keyof CommandsOptions;

export type OptionsName = keyof typeof Options;

export type OptionsTypes = z.infer<typeof OptionsSchema>;

export type ConfigFileOptions = z.infer<typeof ConfigFileOptionsSchema>;
