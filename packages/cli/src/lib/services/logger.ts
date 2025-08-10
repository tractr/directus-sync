import { Inject, Service } from 'typedi';
import Logger from 'pino';
import pino, { LoggerOptions, LevelWithSilentOrString } from 'pino';
import { LOGGER_CONFIG } from '../constants';

export type LogLevel =
  | 'info'
  | 'error'
  | 'debug'
  | 'trace'
  | 'warn'
  | 'fatal'
  | 'silent';
export type LoggerConfig = {
  transport: LoggerOptions['transport'];
  level: LevelWithSilentOrString;
};

@Service({ global: true })
export class LoggerService {
  /**
   * The logger instance
   */
  protected logger: pino.Logger;

  constructor(@Inject(LOGGER_CONFIG) protected readonly config: LoggerConfig) {
    this.logger = Logger({
      level: this.config.level,
      transport: this.config.transport,
    });
  }

  protected log(
    level: LogLevel,
    object_or_message: object | string,
    message?: string,
  ) {
    if (level === 'info') {
      this.logger.info(object_or_message, message);
    } else if (level === 'error') {
      this.logger.error(object_or_message, message);
    } else if (level === 'debug') {
      this.logger.debug(object_or_message, message);
    } else if (level === 'trace') {
      this.logger.trace(object_or_message, message);
    } else if (level === 'warn') {
      this.logger.warn(object_or_message, message);
    } else if (level === 'fatal') {
      this.logger.fatal(object_or_message, message);
    } else if (level === 'silent') {
      this.logger.silent(object_or_message, message);
    }
  }

  info(object_or_message: object | string, message?: string) {
    this.log('info', object_or_message, message);
  }

  error(object_or_message: object | string, message?: string) {
    this.log('error', object_or_message, message);
  }

  debug(object_or_message: object | string, message?: string) {
    this.log('debug', object_or_message, message);
  }

  trace(object_or_message: object | string, message?: string) {
    this.log('trace', object_or_message, message);
  }

  warn(object_or_message: object | string, message?: string) {
    this.log('warn', object_or_message, message);
  }

  fatal(object_or_message: object | string, message?: string) {
    this.log('fatal', object_or_message, message);
  }

  silent(object_or_message: object | string, message?: string) {
    this.log('silent', object_or_message, message);
  }

  flush() {
    this.logger.flush();
  }

  getChild(prefix: string): pino.Logger {
    return this.logger.child(
      {},
      {
        msgPrefix: `[${prefix}] `,
      },
    );
  }
}
