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
    const { interval, timeout, successes } =
      this.config.getWaitForServerReadyConfig();
    const intervalMs = interval * 1000;
    const timeoutMs = timeout * 1000;
    const endAt = Date.now() + timeoutMs;
    let consecutiveSuccesses = 0;

    this.logger.info(
      `Waiting for server to be ready (timeout ${timeout}s, interval ${interval}s, successes ${successes})`,
    );

    // Poll until ready or timeout
    while (Date.now() < endAt) {
      const ready = await this.checkServerStatus().catch(() => false);
      consecutiveSuccesses = ready ? consecutiveSuccesses + 1 : 0;
      if (consecutiveSuccesses >= successes) {
        this.logger.info('Server is ready');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(`Timeout waiting for server to be ready after ${timeout}s`);
  }

  protected async checkServerStatus() {
    try {
      const client = await this.migrationClient.get();
      const result = await client.request(serverHealth());
      const isOk = result?.status === 'ok';
      this.logger.debug(`Server status: ${result?.status}`);
      return isOk;
    } catch (e) {
      this.logger.debug(`Error checking server status: ${e}`);
      return false;
    }
  }
}
