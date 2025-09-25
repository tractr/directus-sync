import Keyv from 'keyv';
import { useEnv } from '@directus/env';

const env = useEnv();

export class KeyvClient {
  protected readonly clients: Keyv[];

  constructor() {
    this.clients = [
      this.getClient(''),
      this.getClient('_system'),
      this.getClient('_schema'),
      this.getClient('_lock'),
    ];
  }

  protected getClient(namespaceSuffix: string) {
    return new Keyv({
      namespace: `${env.CACHE_NAMESPACE as string}${namespaceSuffix}`,
    });
  }

  async reset() {
    await Promise.all(this.clients.map((client) => client.clear()));
  }
}
