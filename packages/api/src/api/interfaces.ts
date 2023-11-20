import {
  Response,
  Request as BaseRequest,
  NextFunction,
} from 'express-serve-static-core';

export interface Request extends BaseRequest {
  accountability?: {
    user?: unknown;
    admin?: boolean;
  };
}
export type { Response, NextFunction };
