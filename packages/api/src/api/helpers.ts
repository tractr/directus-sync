import { z, ZodError, ZodSchema } from 'zod';
import createError, { isHttpError } from 'http-errors';
import pino from 'pino';
import { NextFunction, Request, Response } from './interfaces';

/**
 * Helpers to ensure the user is an admin
 */
export function ensureIsAdminHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
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
 * Extract params from a query and
 */
export function validateInput<T extends ZodSchema>(
  payload: unknown,
  schema: T,
): z.infer<T> {
  try {
    return schema.parse(payload);
  } catch (error) {
    const message =
      error instanceof ZodError
        ? error.issues
            .map((e) => `[${e.path.join(',')}] ${e.message}`)
            .join('. ')
        : (error as string);
    throw new Error(message);
  }
}

/**
 * Error handler for express
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }
  if (isHttpError(err)) {
    res.status(err.statusCode);
  } else {
    res.status(500);
  }
  res.json({ message: err.message });
}

/**
 * Helper to log errors using pino
 */
export function logError(logger: pino.Logger) {
  return function (
    err: Error,
    _req: Request,
    _res: Response,
    next: NextFunction,
  ) {
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
