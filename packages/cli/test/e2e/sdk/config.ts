import * as getenv from 'getenv';

export function getSetupTimeout() {
  return getenv.int('JEST_TIMEOUT_SETUP', 10000);
}
