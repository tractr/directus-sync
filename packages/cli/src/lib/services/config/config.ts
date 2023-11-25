import { Service } from 'typedi';
import { ConfigFileOptions, OptionName, Options } from './interfaces';
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
      level: this.getOptions('debug') ? 'debug' : 'info',
    };
  }

  @Cacheable()
  getCollectionsConfig() {
    const dumpPath = Path.resolve(this.getOptions('dumpPath'));
    const collectionsSubPath = this.getOptions('collectionsPath');
    const collectionsPath = Path.resolve(dumpPath, collectionsSubPath);
    return {
      dumpPath: collectionsPath,
    };
  }

  @Cacheable()
  getSnapshotConfig() {
    const dumpPath = Path.resolve(this.getOptions('dumpPath'));
    const snapshotSubPath = this.getOptions('snapshotPath');
    const snapshotPath = Path.resolve(dumpPath, snapshotSubPath);
    return {
      dumpPath: snapshotPath,
      splitFiles: this.getOptions('split'),
      force: this.getOptions('force'),
    };
  }

  @Cacheable()
  getDirectusConfig() {
    return {
      url: this.getOptions('directusUrl'),
      token: this.getOptions('directusToken'),
    };
  }

  @Cacheable()
  getUntrackConfig() {
    return {
      collection: this.getOptions('collection'),
      id: this.getOptions('id'),
    };
  }

  @Cacheable()
  getConfigFileLoaderConfig() {
    return this.getOptions('configPath');
  }

  protected getOptions<T extends OptionName>(
    name: T,
    defaultValue?: Options[T],
  ): Required<Options>[T] {
    const options = this.flattenOptions();
    if (options[name] !== undefined) {
      return options[name] as Required<Options>[T];
    }
    if (defaultValue === undefined) {
      throw new Error(`missing option ${name}`);
    }
    return defaultValue as Required<Options>[T];
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
