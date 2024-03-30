export function sleep(duration: number): Promise<void> {
  return new Promise((r) => setTimeout(r, duration));
}
