import { ConfigFileOptionsSchema } from './schema';
import { ConfigFileOptions } from './interfaces';
import { existsSync } from 'fs-extra';
import deepmerge from 'deepmerge';
import Path from 'path';
import { zodParse } from '../../helpers';

export class ConfigFileLoader {
  protected loadedConfig: ConfigFileOptions | undefined;

  protected loadedConfigPaths: string[] = [];

  constructor(protected readonly configPath: string) {
    this.loadedConfig = this.loadFromPath(this.configPath);
  }

  get(): ConfigFileOptions | undefined {
    return this.loadedConfig;
  }

  protected loadFromPath(configPath: string): ConfigFileOptions | undefined {
    // Check if the config is already loaded
    // If the config is already loaded, return undefined to avoid infinite loop
    if (this.loadedConfigPaths.includes(configPath)) {
      return undefined;
    }
    // Check if the config exists
    if (!existsSync(configPath)) {
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const rawConfig = require(configPath);
    // Validate and return the config
    const config = zodParse(rawConfig, ConfigFileOptionsSchema, 'Config file');
    // Add the config to the loaded config
    this.loadedConfigPaths.push(configPath);
    // Merge with parents
    return this.mergeWithParents(config, configPath);
  }

  protected mergeWithParents(
    config: ConfigFileOptions,
    currentPath: string,
  ): ConfigFileOptions {
    const extendsPath = config.extends;
    if (!extendsPath) {
      return config;
    }
    let mergedConfig = config;
    for (const parentPath of extendsPath) {
      const parentFullPath = Path.resolve(
        Path.dirname(currentPath),
        parentPath,
      );
      const parentConfig = this.loadFromPath(parentFullPath);
      if (!parentConfig) {
        continue;
      }
      mergedConfig = deepmerge(parentConfig, mergedConfig);
    }
    return mergedConfig;
  }
}
