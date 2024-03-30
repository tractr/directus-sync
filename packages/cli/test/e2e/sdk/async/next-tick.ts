import { sleep } from './sleep';

export function nextTick(): Promise<void> {
  return sleep(0);
}
