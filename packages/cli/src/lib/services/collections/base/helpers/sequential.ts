export async function runSequentially<T>(
  tasks: Array<() => Promise<T>>,
): Promise<T[]> {
  const results: T[] = [];
  for (const task of tasks) {
    // Await each task before moving to the next to ensure sequential execution
    const result = await task();
    results.push(result);
  }
  return results;
}
