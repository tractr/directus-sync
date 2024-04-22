import { sleep } from './async/index.js';
import { DirectusClient } from './directus-client.js';
import { Subject } from 'rxjs';
import { startServer } from './directus-server.js';
import getenv from 'getenv';

export class DirectusInstance {
  protected readonly directusClient: DirectusClient;
  protected serverKiller: Subject<void> | undefined;

  constructor() {
    this.directusClient = new DirectusClient(this.getUrl());
  }

  getDirectusClient() {
    return this.directusClient;
  }

  getUrl() {
    const port = getenv.int('PORT');
    const hostname = getenv.string('HOST');
    return `http://${hostname}:${port}`;
  }

  async start() {
    this.serverKiller = await startServer();
    await this.waitForDirectusToBeReady();
  }

  stop() {
    this.serverKiller?.next();
    delete this.serverKiller;
  }

  protected async waitForDirectusToBeReady(timeout = 30000): Promise<void> {
    let timePassed = 0;
    const startTime = Date.now();
    while (timePassed < timeout) {
      try {
        const ping = await this.directusClient.ping();
        if (ping === 'pong') {
          return;
        }
      } catch (error) {
        // Ignore error
      }
      timePassed = Date.now() - startTime;
      await sleep(500);
    }
  }
}
