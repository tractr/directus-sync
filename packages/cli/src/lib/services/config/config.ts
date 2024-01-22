import { Service } from 'typedi';
import {
  ConfigFileOptions,
  DirectusConfigWithCredentials,
  DirectusConfigWithToken,
  OptionName,
  Options,
  TransformDataHookName,
  TransformDataHooks,
} from './interfaces';
import Path from 'path';
import { Cacheable } from 'typescript-cacheable';
import { ConfigFileLoader } from './config-file-loader';
import { zodParse } from '../../helpers';
import deepmerge from 'deepmerge';
import { DefaultConfig } from './default-config';
import { OptionsSchema } from './schema';

@Service()
export class ConfigService {
  protected programOptions: Partial<Options> | undefined;

  protected commandOptions: Partial<Options> | undefined;

  setOptions(
    programOptions: Partial<Options>,
    commandOptions: Partial<Options>,
  ) {
    this.programOptions = programOptions;
    this.commandOptions = commandOptions;
  }

  @Cacheable()
  getLoggerConfig() {
    return {
      level: this.requireOptions('debug') ? 'debug' : 'info',
    };
  }

  @Cacheable()
  getCollectionsConfig() {
    const dumpPath = Path.resolve(this.requireOptions('dumpPath'));
    const collectionsSubPath = this.requireOptions('collectionsPath');
    const collectionsPath = Path.resolve(dumpPath, collectionsSubPath);
    return {
      dumpPath: collectionsPath,
    };
  }

  @Cacheable()
  getSnapshotConfig() {
    const dumpPath = Path.resolve(this.requireOptions('dumpPath'));
    const snapshotSubPath = this.requireOptions('snapshotPath');
    const snapshotPath = Path.resolve(dumpPath, snapshotSubPath);
    return {
      dumpPath: snapshotPath,
      splitFiles: this.requireOptions('split'),
      force: this.requireOptions('force'),
    };
  }

  /**
   * Returns the Directus config, either with a token or with an email/password
   */
  @Cacheable()
  getDirectusConfig(): DirectusConfigWithToken | DirectusConfigWithCredentials {
    const url = this.requireOptions('directusUrl');
    const token = this.getOptions('directusToken');
    if (token) {
      return { url, token };
    }

    const email = this.requireOptions('directusEmail');
    const password = this.requireOptions('directusPassword');
    return { url, email, password };
  }

  @Cacheable()
  getUntrackConfig() {
    return {
      collection: this.requireOptions('collection'),
      id: this.requireOptions('id'),
    };
  }

  @Cacheable()
  getConfigFileLoaderConfig() {
    return this.requireOptions('configPath');
  }

  @Cacheable()
  getHooksConfig(
    collection: TransformDataHookName,
  ): TransformDataHooks | undefined {
    const hooks = this.getOptions('hooks');
    if (!hooks) {
      return undefined;
    }
    return hooks[collection] as TransformDataHooks | undefined;
  }

  protected getOptions<T extends OptionName>(name: T): Options[T] | undefined {
    const options = this.flattenOptions();
    return options[name];
  }

  protected requireOptions<T extends OptionName>(
    name: T,
  ): Required<Options>[T] {
    const value = this.getOptions(name);
    if (value !== undefined) {
      return value as Required<Options>[T];
    }
    throw new Error(`Missing option ${name}`);
  }

  /**
   * Options overridden in this order:
   * 1. Default options
   * 2. Config file options
   * 3. Program options
   * 4. Command options
   */
  @Cacheable()
  protected flattenOptions() {
    let options = {};
    options = deepmerge(options, DefaultConfig);
    options = deepmerge(options, this.getFileOptions() ?? {});
    options = deepmerge(options, this.programOptions ?? {});
    options = deepmerge(options, this.commandOptions ?? {});
    // Validate options
    return zodParse(options, OptionsSchema, 'Options parsing');
  }

  @Cacheable()
  protected getFileOptions(): ConfigFileOptions | undefined {
    const configPath =
      this.programOptions?.configPath ?? DefaultConfig.configPath;
    if (!configPath) {
      throw new Error('missing config file path');
    }
    const configFullPath = Path.resolve(configPath);
    return new ConfigFileLoader(configFullPath).get();
  }
}
