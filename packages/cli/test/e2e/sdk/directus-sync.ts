import { DirectusSyncArgs } from './interfaces';
import { streamCommand } from './shell';
import { reduce, take } from 'rxjs/operators';
import { filter, lastValueFrom } from 'rxjs';

export class DirectusSync {
  constructor(protected readonly options: DirectusSyncArgs) {}

  pull() {
    return this.runCliCommand('pull', '--dump-path', this.options.dumpPath);
  }

  push() {
    return this.runCliCommand('push', '--dump-path', this.options.dumpPath);
  }

  diff() {
    return this.runCliCommand('diff', '--dump-path', this.options.dumpPath);
  }

  protected runCliCommand(...args: string[]) {
    return lastValueFrom(
      streamCommand('npm', [
        'start',
        '--',
        ...this.getOptionsArgs(),
        ...args,
      ]).pipe(
        reduce((acc, line) => acc + '\n' + line, ''),
        filter((output) => output.includes('Done!')),
        take(1),
      ),
    );
  }

  protected getOptionsArgs(): string[] {
    return [
      `--directus-token`,
      this.options.token,
      `--directus-url`,
      this.options.url,
    ];
  }
}
