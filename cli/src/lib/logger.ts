import chalk from 'chalk';

/**
 * Helper for logging steps.
 * Add an emoji to the step name to make it stand out.
 */
export function logStep(step: string) {
  console.log(`\n⚙️  ${chalk.magenta(step + '...')}`);
}

/**
 * Helper for logging info.
 */
export function logInfo(message: string) {
  console.log(`ℹ️  ${message}`);
}

/**
 * Helper for logging message.
 */
export function logMessage(...message: string[]) {
  console.log(...message);
}

/**
 * Helper for logging message.
 */
export function logMessageWithObject(message: string, object: object) {
  console.log(message, chalk.grey(JSON.stringify(object)));
}

/**
 * Helper for logging error.
 */
export function logErrorAndStop(error: string | Error) {
  if (typeof error === 'string') {
    console.error(`❌  ${chalk.red(error)}`);
  } else {
    console.error(`❌  ${chalk.red(error.message || 'Error')}`);
    console.error(error);
  }
  process.exit(1);
}

/**
 * Helper for logging success.
 */
export function logEndAndClose() {
  console.log(`✅  Done!`);
  process.exit(0);
}
