declare module '@directus/api' {
  export function createApp(): Promise<import('express').Application>;
}
