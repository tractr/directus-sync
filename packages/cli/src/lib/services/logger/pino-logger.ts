import { Logger } from './logger';
import { LoggerConfig } from './interfaces';
import pino from 'pino';


export class PinoLogger extends Logger<pino.Logger> {
  protected worker: pino.Logger;

  constructor(config: LoggerConfig) {
    super()
    this.worker = pino({
      level: config.level,
      transport: config.transport,
    });
  }

  getChild(prefix: string): pino.Logger {
    return this.worker.child(
      {},
      {
        msgPrefix: `[${prefix}] `,
      },
    );
  }
}
