export function retry<T>(
  run: () => Promise<T> | T,
  maxRetries = 3,
  sleepTime = 1000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    let retries = 1;
    const runWithRetries = async () => {
      try {
        const result = await run();
        resolve(result);
      } catch (error) {
        if (retries < maxRetries) {
          retries++;
          setTimeout(runWithRetries, sleepTime);
        } else {
          reject(error instanceof Error ? error : new Error(error as string));
        }
      }
    };
    runWithRetries().catch(reject);
  });
}
