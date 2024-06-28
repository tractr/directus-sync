import { Service } from 'typedi';
import {
  ConfigFileOptions,
  DirectusConfigWithCredentials,
  DirectusConfigWithToken,
  CollectionName,
  CollectionHooks,
  SnapshotHooks,
  OptionName,
  Options,
  CollectionPreservableIdName,
} from './interfaces';
import Path from 'path';
import { Cacheable } from 'typescript-cacheable';
import { ConfigFileLoader } from './config-file-loader';
import { zodParse } from '../../helpers';
import deepmerge from 'deepmerge';
import { DefaultConfig, DefaultConfigPaths } from './default-config';
import { CollectionsList, OptionsSchema } from './schema';

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
      enabled: this.requireOptions('snapshot'),
    };
  }

  @Cacheable()
  getSpecificationsConfig() {
    const dumpPath = Path.resolve(this.requireOptions('dumpPath'));
    const specificationsSubPath = this.requireOptions('specsPath');
    const specificationsPath = Path.resolve(dumpPath, specificationsSubPath);
    return {
      dumpPath: specificationsPath,
      enabled: this.requireOptions('specs'),
    };
  }

  /**
   * Returns the Directus config, either with a token or with an email/password
   */
  @Cacheable()
  getDirectusConfig(): DirectusConfigWithToken | DirectusConfigWithCredentials {
    const url = this.requireOptions('directusUrl');
    const clientConfig = this.getOptions('directusConfig')?.clientOptions;
    const token = this.getOptions('directusToken');
    if (token) {
      return { url, token, clientConfig };
    }

    const email = this.requireOptions('directusEmail');
    const password = this.requireOptions('directusPassword');
    return { url, email, password, clientConfig };
  }

  @Cacheable()
  getUntrackConfig() {
    return {
      collection: this.requireOptions('collection'),
      id: this.requireOptions('id'),
    };
  }

  @Cacheable()
  getRemovePermissionDuplicatesConfig() {
    return {
      keep: this.requireOptions('keep'),
    };
  }

  @Cacheable()
  getConfigFileLoaderConfig() {
    return this.requireOptions('configPath');
  }

  @Cacheable()
  getCollectionHooksConfig(collection: CollectionName): CollectionHooks {
    const hooks = this.getOptions('hooks');
    if (!hooks) {
      return {};
    }
    // Type assertion is needed because the schema does not define the function arguments
    return (hooks[collection] ?? {}) as CollectionHooks;
  }

  @Cacheable()
  getSnapshotHooksConfig(): SnapshotHooks {
    const hooks = this.getOptions('hooks');
    if (!hooks) {
      return {};
    }
    // Type assertion is needed because the schema does not define the function arguments
    return (hooks.snapshot ?? {}) as SnapshotHooks;
  }

  @Cacheable()
  getCollectionsToProcess() {
    const exclude = this.requireOptions('excludeCollections');
    const only = this.requireOptions('onlyCollections');
    const list = only.length > 0 ? only : CollectionsList;
    return list.filter((collection) => !exclude.includes(collection));
  }

  @Cacheable()
  shouldPreserveIds(collection: CollectionPreservableIdName) {
    const preserveIds = this.requireOptions('preserveIds');
    return (
      preserveIds === '*' ||
      preserveIds === 'all' ||
      preserveIds.includes(collection)
    );
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
    const customConfigPath = this.programOptions?.configPath;
    const possiblePaths = [
      ...(customConfigPath ? [Path.resolve(customConfigPath)] : []),
      ...DefaultConfigPaths.map((p) => Path.resolve(p)),
    ];

    // Try to load the config file from the possible paths
    for (const configPath of possiblePaths) {
      const config = new ConfigFileLoader(configPath).get();
      if (config) {
        return config;
      }
    }

    return undefined;
  }
}
