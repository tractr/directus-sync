import { Service } from 'typedi';
import {
  CommandName,
  CommandsOptions,
  OptionsName,
  OptionsTypes,
  ProgramOptions,
} from './interfaces';
import Path from 'path';
import { CommandsOptionsSchemas, ProgramOptionsSchema } from './schema';
import { Cacheable } from 'typescript-cacheable';

@Service()
export class ConfigService {
  protected programOptions: ProgramOptions | undefined;

  protected commandOptions: CommandsOptions[CommandName] | undefined;

  protected commandName: CommandName | undefined;

  setOptions(
    programOptions: ProgramOptions,
    commandName: CommandName,
    commandOptions: CommandsOptions[CommandName],
  ) {
    this.programOptions = programOptions;
    this.commandName = commandName;
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
    const dumpPath = this.getOptions('dumpPath');
    const collectionsSubPath = this.getOptions('collectionsPath');
    const collectionsPath = Path.join(dumpPath, collectionsSubPath);
    return {
      dumpPath: collectionsPath,
    };
  }

  @Cacheable()
  getSnapshotConfig() {
    const dumpPath = this.getOptions('dumpPath');
    const snapshotSubPath = this.getOptions('snapshotPath');
    const snapshotPath = Path.join(dumpPath, snapshotSubPath);
    return {
      dumpPath: snapshotPath,
      splitFiles: this.getOptions('split'),
      force: this.getOptions('force', false),
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

  protected getOptions<T extends OptionsName>(
    name: T,
    defaultValue?: OptionsTypes[T],
  ): OptionsTypes[T] {
    const commandOptions = this.getCommandOptions();
    if (commandOptions[name as keyof typeof commandOptions] !== undefined) {
      return commandOptions[
        name as keyof typeof commandOptions
      ] as OptionsTypes[T];
    }
    const programOptions = this.getGlobalOptions();
    if (programOptions[name as keyof ProgramOptions] !== undefined) {
      return programOptions[name as keyof ProgramOptions] as OptionsTypes[T];
    }
    if (defaultValue === undefined) {
      throw new Error(`missing option ${name}`);
    }
    return defaultValue;
  }

  protected getGlobalOptions() {
    if (!this.programOptions) {
      throw new Error('program options not set');
    }
    return ProgramOptionsSchema.parse(this.programOptions);
  }

  protected getCommandOptions() {
    if (!this.commandName) {
      throw new Error('command name not set');
    }
    if (!this.commandOptions) {
      throw new Error('command options not set');
    }
    const schema = CommandsOptionsSchemas[this.commandName];
    if (!schema) {
      throw new Error(`missing schema for command ${this.commandName}`);
    }
    return schema.parse(this.commandOptions);
  }
}
