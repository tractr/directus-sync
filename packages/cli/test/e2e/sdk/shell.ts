import { ChildProcess, ChildProcessWithoutNullStreams, exec, spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { Observable } from 'rxjs';

/**
 * Executes shell command and return as a Promise.
 */
export function $(
  parts: TemplateStringsArray,
  ...params: any[]
): Promise<{ stdout: string; stderr: string }> {
  // Glue the command and parameters together
  const cmd = parts.reduce((acc, part, i) => {
    return acc + part + (params[i] || '');
  }, '');
  return new Promise((resolve, reject) => {
    let childProcess: ChildProcess;
    childProcess = exec(
      cmd,
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
        }
        resolve({ stdout, stderr });
        if (childProcess) {
          childProcess.kill();
        }
      },
    );
  });
}

export function streamCommand(
  command: string,
  args: string[] = [],
  opts?: SpawnOptionsWithoutStdio,
): Observable<string> {
  return new Observable((observer) => {
    const process: ChildProcessWithoutNullStreams = spawn(command, args, opts);
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
      observer.error(new Error(data.toString()));
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
      process.kill();
    };
  });
}
