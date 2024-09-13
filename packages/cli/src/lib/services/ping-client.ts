import { ExtensionClient, NO_ID_MAP_MESSAGE } from './extension-client';
import { MigrationClient } from './migration-client';
import { Service } from 'typedi';

@Service()
export class PingClient extends ExtensionClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  /** Try to get a fake id map in order to check if the server is up and the extension is installed */
  async test() {
    const response = await this.fetch<unknown>(
      `/table/__ping_test__/sync_id/__ping_test__`,
      'GET',
    )
      .then(() => ({ success: true }))
      .catch((error: Error) => ({ error }));

    if ('success' in response) {
      return; // Should not happen
    }

    if (response.error.message === NO_ID_MAP_MESSAGE) {
      return;
    }

    throw response.error;
  }
}
