import { z } from 'zod';
import {
  ConfigFileOptionsSchema,
  OptionsFields,
  OptionsHooksSchema,
  OptionsSchema,
  TransformDataHooksSchema,
} from './schema';

export type OptionName = keyof typeof OptionsFields;

export type Options = z.infer<typeof OptionsSchema>;

export type ConfigFileOptions = z.infer<typeof ConfigFileOptionsSchema>;

export type TransformDataHookName = keyof typeof OptionsHooksSchema.shape;

export type TransformDataFunction = <T = unknown>(
  data: T[],
) => T[] | Promise<T[]>;

export type TransformDataHooks = {
  [key in keyof typeof TransformDataHooksSchema.shape]?: TransformDataFunction;
};

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
