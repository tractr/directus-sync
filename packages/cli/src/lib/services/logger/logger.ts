import { LoggerWorker, LogLevel } from './interfaces';

export abstract class Logger implements LoggerWorker {
  protected abstract readonly worker: LoggerWorker;

  protected log(
    level: LogLevel,
    object_or_message: object | string,
    message?: string,
  ) {
    if (level === 'info') {
      this.worker.info(object_or_message, message);
    } else if (level === 'error') {
      this.worker.error(object_or_message, message);
    } else if (level === 'debug') {
      this.worker.debug(object_or_message, message);
    } else if (level === 'trace') {
      this.worker.trace(object_or_message, message);
    } else if (level === 'warn') {
      this.worker.warn(object_or_message, message);
    } else if (level === 'fatal') {
      this.worker.fatal(object_or_message, message);
    } else if (level === 'silent') {
      this.worker.silent(object_or_message, message);
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
    this.worker.flush();
  }

  abstract getChild(prefix: string): Logger;
}
