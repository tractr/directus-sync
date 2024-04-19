import crypto from 'crypto';
import { Subject } from 'rxjs';
import fs from 'fs-extra';
import path from 'path';

const directusBaseFolder = path.resolve('directus');
const baseDbPath = path.resolve(directusBaseFolder, 'db', 'base.db');

export interface ServerOptions {
  hostname?: string; // Default to '0.0.0.0'
  port: number;
  logLevel?: string; // Default to 'fatal'
}

let serverIsRunning = false;

export async function startServer({
  hostname = '0.0.0.0',
  port,
  logLevel = 'fatal',
}: ServerOptions): Promise<Subject<void>> {
  // Ensure no more than one server is running
  if (serverIsRunning) {
    throw new Error('A server is already running');
  }

  serverIsRunning = true;

  // Create a subject to terminate the server
  const killer = new Subject<void>();

  // Define required environment variables
  const originalEnvs = addExtraEnvs({
    port,
    logLevel,
    hostname,
  });

  // Copy the base database
  const dbFilePath = getDbFilePath(port);
  fs.rmSync(dbFilePath, { force: true });
  fs.copyFileSync(baseDbPath, dbFilePath);

  // Create the Directus server
  const { createApp } = await import('@directus/api');
  const app = await createApp();

  // Start the server
  const server = app
    .listen(port, hostname, () => {
      process.send?.('ready');
    })
    .once('error', (err: Error & { code: string }) => {
      serverIsRunning = false;
      if (err?.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
      }
      throw err;
    })
    .once('close', () => {
      serverIsRunning = false;
      process.env = { ...originalEnvs };
      // fs.rmSync(dbFilePath, { force: true });
      killer.complete();
    });

  killer.subscribe(() => {
    server.close();
  });

  return killer;
}

/**
 * Create environment variables for the Directus server
 * Return the original environment variables so they can be restored later
 */
function addExtraEnvs({ port, logLevel, hostname }: ServerOptions) {
  const originalEnv = { ...process.env };
  const { email, password } = getAdminCredentials();
  process.env = {
    ...process.env,
    HOST: '0.0.0.0',
    KEY: crypto.randomBytes(64).toString('hex'),
    SECRET: crypto.randomBytes(64).toString('hex'),
    PUBLIC_URL: `http://${hostname}:${port}`,
    ADMIN_EMAIL: email,
    ADMIN_PASSWORD: password,
    LOG_LEVEL: logLevel,
    DB_CLIENT: 'sqlite3',
    DB_FILENAME: getDbFilePath(port),
    EXTENSIONS_PATH: path.resolve(directusBaseFolder, 'extensions'),
    STORAGE_LOCAL_ROOT: path.resolve(directusBaseFolder, 'uploads'),
  };
  return originalEnv;
}

/**
 * Returns the db filename from the port
 */
function getDbFilePath(port: number) {
  return path.resolve(directusBaseFolder, 'db', `${port}.db`);
}

/**
 * Returns a default admin email/password
 */
export function getAdminCredentials() {
  return {
    email: 'admin@example.com',
    password: 'password',
  };
}
