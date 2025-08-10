import { Logger } from './logger';
import { LoggerConfig } from './interfaces';
import pino from 'pino';

interface BaseLoggerConfig { base: pino.Logger, prefix: string }

export class PinoLogger extends Logger {
  protected worker: pino.Logger;

  constructor(
    protected readonly config: LoggerConfig | BaseLoggerConfig,
  ) {
    super();
    if (PinoLogger.isBaseLoggerConfig(config)) {
      this.worker = config.base.child({}, {
        msgPrefix: `[${config.prefix}] `,
      });
    } else {
      this.worker = pino({
        level: config.level,
        transport: config.transport,
      });
    }
  }

  protected static isBaseLoggerConfig(config: LoggerConfig | BaseLoggerConfig): config is BaseLoggerConfig {
    return 'base' in config;
  }

  setLevel(level: pino.LevelWithSilentOrString) {
    this.worker.level = level;
  }

  getChild(prefix: string): PinoLogger {
    return new PinoLogger({ base: this.worker, prefix });
  }
}
