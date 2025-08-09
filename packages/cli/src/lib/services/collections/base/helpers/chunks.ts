export function* chunks<T>(
  array: T[],
  chunkSize: number,
): Generator<T[], void> {
  if (!Number.isFinite(chunkSize) || chunkSize <= 0) {
    throw new Error('chunkSize must be a positive number');
  }
  for (let index = 0; index < array.length; index += chunkSize) {
    yield array.slice(index, index + chunkSize);
  }
}
