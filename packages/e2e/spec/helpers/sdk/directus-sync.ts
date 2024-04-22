import { DirectusSyncArgs, PinoLog } from './interfaces/index.js';
import { createProgram, LOGGER_TRANSPORT } from 'directus-sync';
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

  pull() {
    return this.runCliCommand('pull', '--dump-path', this.options.dumpPath);
  }

  push() {
    return this.runCliCommand('push', '--dump-path', this.options.dumpPath);
  }

  diff() {
    return this.runCliCommand('diff', '--dump-path', this.options.dumpPath);
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
    await sleep(500);

    // Read the log file
    const logsContent = fs.readFileSync(logFilePath, 'utf-8');
    const logs: PinoLog[] = logsContent
      .split('\n')
      .map((line) => {
        try {
          return JSON.parse(line);
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
      options: { destination: logFilePath, mkdir: true, append: false },
    };
  }

  protected getLogFilePath(command?: string) {
    const id = uuidV4();
    const fileName = command ? `${command}-${id}` : id;
    return Path.resolve(logDirectory, `${fileName}.log`);
  }
}