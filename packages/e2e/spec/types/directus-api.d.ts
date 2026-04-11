import { Express } from 'express';
declare module '@directus/api' {
  export function createApp(): Promise<Express.Application>;
}
