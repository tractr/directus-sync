import { sleep } from './async/index.js';
import { DirectusClient } from './directus-client.js';
import { Subject } from 'rxjs';
import { startServer, getAdminCredentials } from './directus-server.js';

export class DirectusInstance {
  protected static indexShift = 0;
  protected readonly index: number;
  protected readonly directusClient: DirectusClient;
  protected serverKiller: Subject<void> | undefined;
  protected readonly serverLogLevel = 'fatal'; // 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

  constructor() {

    // Find a port that is not in use
    // Avoid port collision if multiple instances are running in the same process
    this.index = (process.pid % 23000) + DirectusInstance.indexShift;
    DirectusInstance.indexShift += 1;

    const url = `http://127.0.0.1:${this.getDirectusPort()}`;
    const { email, password } = getAdminCredentials();
    this.directusClient = new DirectusClient(url);
    this.directusClient.setAdminCredentials(email, password);
  }

  getDirectusClient() {
    return this.directusClient;
  }

  async start() {
    this.serverKiller = await startServer({
      port: this.getDirectusPort(),
      logLevel: this.serverLogLevel,
    });
    await this.waitForDirectusToBeReady();
  }

  stop() {
    this.serverKiller?.next();
    delete this.serverKiller;
  }


  protected getDirectusPort() {
    return 8060 + this.index;
  }

  protected async waitForDirectusToBeReady(timeout = 30000): Promise<void> {
    let timePassed = 0;
    const startTime = Date.now();
    while (timePassed < timeout) {
      try {
        const ping=  await this.directusClient.ping();
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
