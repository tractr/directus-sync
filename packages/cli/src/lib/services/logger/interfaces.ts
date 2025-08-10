import { LoggerOptions, LevelWithSilentOrString } from 'pino';

export type LogLevel =
  | 'info'
  | 'error'
  | 'debug'
  | 'trace'
  | 'warn'
  | 'fatal'
  | 'silent';

export type LoggerConfigTransport = LoggerOptions['transport'];
export type LoggerConfigLevel = LevelWithSilentOrString;
export interface LoggerConfig {
  transport: LoggerConfigTransport;
  level: LoggerConfigLevel;
}

export interface LoggerWorker {
  info(object_or_message: object | string, message?: string): void;
  error(object_or_message: object | string, message?: string): void;
  debug(object_or_message: object | string, message?: string): void;
  trace(object_or_message: object | string, message?: string): void;
  warn(object_or_message: object | string, message?: string): void;
  fatal(object_or_message: object | string, message?: string): void;
  silent(object_or_message: object | string, message?: string): void;
  flush(): void;
}
