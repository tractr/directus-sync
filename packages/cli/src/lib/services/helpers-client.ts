import { ExtensionClient } from './extension-client';
import { MigrationClient } from './migration-client';
import { Service } from 'typedi';
import { ConfigService } from './config';
import { LoggerService, Logger } from './logger';
import { serverHealth } from '@directus/sdk';

interface DeletedPermission {
  policy: string;
  collection: string;
  action: string;
  ids: string[];
}

@Service({ global: true })
export class HelpersClient extends ExtensionClient {
  protected readonly logger: Logger;

  constructor(
    migrationClient: MigrationClient,
    protected readonly config: ConfigService,
    loggerService: LoggerService,
  ) {
    super(migrationClient);
    this.logger = loggerService.getChild('helpers-client');
  }

  async removePermissionDuplicates() {
    const { keep } = this.config.getRemovePermissionDuplicatesConfig();
    const results = await this.fetch<{
      deletedPermissions: DeletedPermission[];
    }>('/helpers/permissions/duplicates', 'DELETE', { keep });

    for (const result of results.deletedPermissions ?? []) {
      this.logger.info(
        `Deleted ${result.ids.length} duplicated permissions for policy ${result.policy ?? null}, collection ${result.collection}, action ${result.action}`,
      );
    }
  }

  async untrack() {
    const { collection, id } = this.config.getUntrackConfig();
    await this.fetch(`/table/${collection}/local_id/${id}`, 'DELETE');
    this.logger.info(`Untracked ${collection} ${id}`);
  }

  async waitServerReady() {
    const { interval, timeout } = this.config.getWaitForServerReadyConfig();
    const intervalMs = interval * 1000;
    const timeoutMs = timeout * 1000;
    const endAt = Date.now() + timeoutMs;

    this.logger.info(
      `Waiting for server to be ready (timeout ${timeout}s, interval ${interval}s)`,
    );

    // Poll until ready or timeout
    while (Date.now() < endAt) {
      const ready = await this.checkServerHealth().catch(() => false);
      if (ready) {
        this.logger.info('Server is ready');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(`Timeout waiting for server to be ready after ${timeout}s`);
  }

  protected async checkServerHealth() {
    try {
      const client = await this.migrationClient.get();
      const result = await client.request(serverHealth());
      return result?.status === 'ok';
    } catch {
      return false;
    }
  }
}
