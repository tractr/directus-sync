import { LoggerOptions, LevelWithSilentOrString } from 'pino';

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
