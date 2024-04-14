import { getSetupTimeout } from './config';
import { streamCommand } from './shell';
import { sleep } from './async';
import { EndLog, Log, RawLog } from './interfaces';
import { DirectusClient } from './directus-client';
import Path from 'path';
import {
  catchError,
  filter,
  firstValueFrom,
  map,
  mergeMap,
  Observable,
  of,
  share,
  Subject,
  Subscription,
  throwError,
} from 'rxjs';
import { take, tap, timeout } from 'rxjs/operators';
import { isPinoHTTPLog, isPinoLog } from './helpers';

const DirectusWorkingDirectory = Path.resolve(
  __dirname,
  '../../../../../directus',
);

export class DirectusInstance {
  protected static indexShift = 0;
  protected readonly index: number;
  protected readonly directusClient: DirectusClient;
  protected readonly setupTimeout = Math.max(getSetupTimeout() - 1000, 1000);
  protected processSubscription: Subscription | undefined;
  protected $process: Observable<Log> | undefined;
  protected processKiller = new Subject<NodeJS.Signals>();

  constructor() {
    this.index = (process.pid % 20000) + DirectusInstance.indexShift; // Avoid port collision
    DirectusInstance.indexShift += 1;
    this.directusClient = new DirectusClient(this.getDirectusPort());
  }

  getDirectusClient() {
    return this.directusClient;
  }

  async start() {
    this.stop();
    this.$process = this.getDirectusProcess();
    this.processSubscription = this.$process.subscribe(); // Start the process
    await this.waitForDirectusToBeReady();
    await sleep(1000);
  }

  stop() {
    this.processKiller.next('SIGTERM');
    this.processSubscription?.unsubscribe();
    delete this.processSubscription;
    delete this.$process;
  }

  /**
   * Wait for a specific log to appear
   * Take a callback to check if the log is the one we are waiting for
   * Take another callback to check if the log is an error
   * Has a timeout
   * It attaches to the 10 last logs and filter the one that are older than now.
   * So we can't miss a log because it was emitted before we started listening.
   * Also, it keeps track of the last 5 logs and print them in the error message in case of timeout.
   */
  waitForLog(
    successLogPredicate: (log: Log) => boolean,
    failureLogPredicate: (log: Log) => boolean = () => false,
    maxTime = 10000,
  ): Promise<Log> {
    // Ensure the process is defined
    if (!this.$process) {
      throw new Error('Process is not created');
    }

    const lastLogs: string[] = [];
    const lastLogsLength = 5;

    return firstValueFrom(
      this.$process.pipe(
        // Keep track of the last logs
        map((log) => {
          lastLogs.push(this.formatLogMessage(log));
          if (lastLogs.length > lastLogsLength) {
            lastLogs.shift();
          }
          return log;
        }),
        // Check if the log is an error
        mergeMap((log) => {
          if (failureLogPredicate(log)) {
            return throwError(
              () =>
                new Error(
                  `Log triggered failure: ${this.formatLogMessage(log)}`,
                ),
            );
          }
          return of(log);
        }),
        // Wait for the log to appear
        filter(successLogPredicate),
        // Take the first log
        take(1),
        // Timeout
        timeout(maxTime),
        // Catch timeout error for better error message
        catchError((error) => {
          if (error.name === 'TimeoutError') {
            const lastLogsString = lastLogs
              .map((log) => `>>> ${log}`)
              .join('\n');
            const customError = new Error(`Timeout waiting for log`);
            customError.stack = `Timeout waiting for log. Last logs from Directus :\n${lastLogsString}`;
            throw customError;
          }
          throw error;
        }),
      ),
      {
        defaultValue: {
          type: 'end',
          msg: 'Process has ended before log was found',
        } satisfies EndLog,
      },
    );
  }

  protected getDirectusPort() {
    return 8060 + this.index;
  }

  protected async waitForDirectusToBeReady(maxRetry = 3): Promise<void> {
    const log = await this.waitForLog(
      (log) => {
        if (!isPinoLog(log)) {
          return false;
        }
        return log.msg.includes('Server started at http:');
      },
      () => false,
      this.setupTimeout,
    );
    if ((log as EndLog).type === 'end') {
      if (maxRetry <= 0) {
        throw new Error(this.formatLogMessage(log));
      }
      await this.waitForDirectusToBeReady(maxRetry - 1);
    }
  }

  /**
   * Start and stream the logs of the directus container
   * Emit one line at a time.
   * Parse the line as JSON.
   * If not JSON, emit as { type: 'raw' content: string }.
   */
  protected getDirectusProcess(): Observable<Log> {
    return streamCommand(
      './start.sh',
      [this.getDirectusPort().toString()],
      {
        cwd: DirectusWorkingDirectory,
      },
      this.processKiller,
    ).pipe(
      // Try to parse the line as JSON
      map((line) => {
        try {
          return JSON.parse(line) as Log;
        } catch (error) {
          return { type: 'raw', msg: line } as RawLog;
        }
      }),
      share(),
    );
  }

  /**
   * Format the log message to be more readable
   */
  protected formatLogMessage(log: Log) {
    if (isPinoHTTPLog(log)) {
      return `${log.req.method} ${log.req.url} (Status: ${log.res.statusCode}, Message: ${log.msg})`;
    }
    return log.msg;
  }

  /**
   * Send every log to console. Useful for debugging
   */
  pipeLogsToConsole() {
    if (this.$process) {
      this.$process.pipe(tap((log) => console.log(log)));
    }
  }
}
