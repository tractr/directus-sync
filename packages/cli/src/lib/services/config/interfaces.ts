import { z } from 'zod';
import {
  ConfigFileOptionsSchema,
  OptionsFields,
  OptionsSchema,
} from './schema';

export type OptionName = keyof typeof OptionsFields;

export type Options = z.infer<typeof OptionsSchema>;

export type ConfigFileOptions = z.infer<typeof ConfigFileOptionsSchema>;

interface DirectusConfigBase {
  url: string;
}
export interface DirectusConfigWithToken extends DirectusConfigBase {
  token: string;
}
export interface DirectusConfigWithCredentials extends DirectusConfigBase {
  email: string;
  password: string;
}
