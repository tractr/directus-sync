import { Inject, Service } from 'typedi';
import { LOGGER_CONFIG } from '../../constants';
import { LoggerConfig } from './interfaces';
import { PinoLogger } from './pino-logger';

@Service({ global: true })
export class LoggerService extends PinoLogger {

  constructor(@Inject(LOGGER_CONFIG) protected readonly config: LoggerConfig) {
    super(config);
  }
}
