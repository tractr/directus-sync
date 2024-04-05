import {
  ChildProcessWithoutNullStreams,
  spawn,
  SpawnOptionsWithoutStdio,
} from 'child_process';
import { Observable, Subscription } from 'rxjs';

export function streamCommand(
  command: string,
  args: string[] = [],
  opts?: SpawnOptionsWithoutStdio,
  killer?: Observable<NodeJS.Signals>,
): Observable<string> {
  let process: ChildProcessWithoutNullStreams;
  let killerSubscription: Subscription | undefined;
  const observable = new Observable<string>((observer) => {
    process = spawn(command, args, { shell: true, ...(opts ?? {}) });
    // Pipe stdout
    process.stdout.on('data', (data: Buffer) => {
      data
        .toString()
        .split('\n')
        .filter((line) => line.length > 0)
        .forEach((line) => {
          observer.next(line);
        });
    });

    // Pipe stderr
    process.stderr.on('data', (data: Buffer) => {
      const content = data.toString();
      if (content.includes('Update available!')) {
        return;
      }
      observer.error(content);
    });

    // Complete the observable when the process completes
    process.on('close', (code) => {
      if (code === 0) {
        observer.complete();
      } else {
        observer.error(new Error(`Process exited with code ${code}`));
      }
    });

    // Kill the process if the subscription is closed
    return () => {
      process.exitCode === null && process.kill('SIGKILL');
    };
  });

  // Listen to killer observable and kill the process
  if (killer) {
    killerSubscription = killer.subscribe((signal) => {
      process.kill(signal);
      killerSubscription?.unsubscribe();
    });
  }

  return observable;
}
