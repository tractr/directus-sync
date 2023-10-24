import { ZodSchema } from 'zod';
import createError, { HttpError, isHttpError } from 'http-errors';

/**
 * Helpers to ensure the user is an admin
 */
export function ensureIsAdminHandler(req: any, _res: any, next: any) {
  const { accountability } = req;
  if (accountability?.user == null) {
    return next(createError(401, 'You must be logged in to access this.'));
  }
  if (!accountability.admin) {
    return next(createError(403, 'You do not have permission to access this.'));
  }
  next();
}

/**
 * Extract params from a request and
 */
export function validateInput<T extends ZodSchema>(
  params: Record<string, any>,
  zodSchema: T,
): Zod.infer<T> {
  try {
    return zodSchema.parse(params);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw createError(400, message);
  }
}

/**
 * Error handler for express
 */
export function errorHandler(err: any, _req: any, res: any, next: any) {
  if (res.headersSent) {
    return next(err);
  }
  const { statusCode, message } = err as HttpError;
  res.status(statusCode || 500);
  res.json({
    message,
  });
}

/**
 * Helper to log errors using pino
 */
export function logError(logger: any) {
  return function (err: any, _req: any, _res: any, next: any) {
    if (isHttpError(err)) {
      // Log only 5xx errors
      if (err.statusCode < 500) {
        return next(err);
      }
      const { message, statusCode } = err;
      logger.error(`${statusCode}: ${message}`);
    } else {
      logger.error(err.message || err);
    }
    next(err);
  };
}
