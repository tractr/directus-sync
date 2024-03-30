import { PinoHTTPLog } from './pino-http';

export interface RawLog {
  type: 'raw';
  msg: string;
}

export interface EndLog {
  type: 'end';
  msg: string;
}

export interface PinoLog {
  level: number;
  time: number;
  msg: string;
  pid: number;
  hostname: string;

  [key: string]: unknown;
}

export type Log = EndLog | RawLog | PinoHTTPLog | PinoLog;
