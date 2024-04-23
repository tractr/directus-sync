import { sleep } from './sleep.js';

export function nextTick(): Promise<void> {
  return sleep(0);
}
