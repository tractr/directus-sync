import Container, { Service } from 'typedi';
import { LOGGER_TRANSPORT } from '../../constants';
import { LoggerConfigTransport } from './interfaces';
import { PinoLogger } from './pino-logger';

@Service({ global: true })
export class LoggerService extends PinoLogger {
  constructor() {
    super({
      transport: LoggerService.getPinoTransport(),
      level: 'info',
    });
  }

  protected static getPinoTransport(): LoggerConfigTransport {
    // Allow to override the log output when running as a programmatic way (not CLI, i.e. tests)
    if (Container.has(LOGGER_TRANSPORT)) {
      return Container.get(LOGGER_TRANSPORT);
    }
    return {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    };
  }
  
}
