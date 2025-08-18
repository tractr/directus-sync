import { DirectusId, DirectusSyncArgs, PinoLog } from './interfaces/index.js';
import { CollectionName, createProgram, LOGGER_TRANSPORT } from 'directus-sync';
import { LoggerOptions } from 'pino';
import { Container } from 'typedi';
import { v4 as uuidV4 } from 'uuid';
import Path from 'path';
import fs from 'fs-extra';
import { sleep } from './async/index.js';

const logDirectory = Path.resolve('logs');

export class DirectusSync {
  /**
   * Avoid running multiple commands at the same time
   * @protected
   */
  protected running = false;

  constructor(protected readonly options: DirectusSyncArgs) {}

  getDumpPath() {
    return this.options.dumpPath;
  }

  pull(args?: string[]) {
    return this.runCliCommand(
      'pull',
      '--dump-path',
      this.options.dumpPath,
      ...(args ?? []),
    );
  }

  push(args?: string[]) {
    return this.runCliCommand(
      'push',
      '--dump-path',
      this.options.dumpPath,
      ...(args ?? []),
    );
  }

  diff(args?: string[]) {
    return this.runCliCommand(
      'diff',
      '--dump-path',
      this.options.dumpPath,
      ...(args ?? []),
    );
  }

  untrack(collection: CollectionName, id: DirectusId) {
    return this.runCliCommand(
      'helpers',
      'untrack',
      '--collection',
      collection,
      '--id',
      id.toString(),
    );
  }

  removePermissionDuplicates(keep: 'last' | 'first') {
    return this.runCliCommand(
      'helpers',
      'remove-permission-duplicates',
      '--keep',
      keep,
    );
  }

  waitServerReady(interval = 5, timeout = 90, successes = 1) {
    return this.runCliCommand(
      'helpers',
      'wait-server-ready',
      '--interval',
      String(interval),
      '--timeout',
      String(timeout),
      '--successes',
      String(successes),
    );
  }

  seedPush(args?: string[]) {
    return this.runCliCommand(
      'seed',
      'push',
      '--seed-path',
      this.options.seedPath,
      ...(args ?? []),
    );
  }

  seedDiff(args?: string[]) {
    return this.runCliCommand(
      'seed',
      'diff',
      '--seed-path',
      this.options.seedPath,
      ...(args ?? []),
    );
  }

  protected async runCliCommand(...args: string[]) {
    // Avoid running multiple commands at the same time
    if (this.running) {
      throw new Error('Another command is already running');
    }
    this.running = true;

    // Create a new log file for each command
    const logFilePath = this.getLogFilePath(args[0]);
    fs.rmSync(logFilePath, { force: true });
    fs.ensureFileSync(logFilePath);
    Container.set(LOGGER_TRANSPORT, this.getLogTransport(logFilePath));

    // Run the command
    const program = createProgram();
    await program.parseAsync([...this.getOptionsArgs(), ...args], {
      from: 'user',
    });

    // Wait for the command to finish and loggers to flush
    await sleep(100);

    // Read the log file
    const logsContent = fs.readFileSync(logFilePath, 'utf-8');
    const logs: PinoLog[] = logsContent
      .split('\n')
      .map((line) => {
        try {
          // Remove all characters before the first '{'
          const start = line.indexOf('{');
          if (start === -1) {
            return null;
          }
          return JSON.parse(line.slice(start));
        } catch {
          return null;
        }
      })
      .filter((log) => log !== null);

    // Clean the container
    Container.reset();

    // Remove the log file (disable next line for debugging)
    // rmSync(logFilePath, { force: true });

    // Allow running another command
    this.running = false;

    // Return the logs
    return logs.map(({ level, msg }) => ({ level, msg }));
  }

  protected getOptionsArgs(): string[] {
    const requiredArgs = this.getRequiredArgs();
    return this.options.configPath
      ? [...requiredArgs, `--config-path`, this.options.configPath]
      : requiredArgs;
  }

  protected getRequiredArgs(): string[] {
    return [
      `--directus-token`,
      this.options.token,
      `--directus-url`,
      this.options.url,
      '--debug',
    ];
  }

  protected getLogTransport(logFilePath: string): LoggerOptions['transport'] {
    return {
      target: 'pino/file',
      options: { destination: logFilePath, mkdir: true, append: true },
    };
  }

  protected getLogFilePath(command?: string) {
    const id = uuidV4();
    const fileName = command ? `${command}-${id}` : id;
    return Path.resolve(logDirectory, `${fileName}.log`);
  }
}
