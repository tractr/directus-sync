import { ExtensionClient } from './extension-client';
import { MigrationClient } from './migration-client';
import { Inject, Service } from 'typedi';
import { LOGGER } from '../constants';
import pino from 'pino';
import { ConfigService } from './config';
import { getChildLogger } from '../helpers';

interface DeletedPermission {
  role: string;
  collection: string;
  action: string;
  ids: string[];
}

@Service()
export class HelpersClient extends ExtensionClient {
  protected readonly logger: pino.Logger;

  constructor(
    migrationClient: MigrationClient,
    protected readonly config: ConfigService,
    @Inject(LOGGER) baseLogger: pino.Logger,
  ) {
    super(migrationClient);
    this.logger = getChildLogger(baseLogger, 'helpers-client');
  }

  async removePermissionDuplicates() {
    const { keep } = this.config.getRemovePermissionDuplicatesConfig();
    const results = await this.fetch<{
      deletedPermissions: DeletedPermission[];
    }>('/helpers/permissions/duplicates', 'DELETE', { keep });

    for (const result of results.deletedPermissions ?? []) {
      this.logger.info(
        `Deleted ${result.ids.length} duplicated permissions for role ${result.role ?? null}, collection ${result.collection}, action ${result.action}`,
      );
    }
  }

  async untrack() {
    const { collection, id } = this.config.getUntrackConfig();
    await this.fetch(`/table/${collection}/local_id/${id}`, 'DELETE');
    this.logger.info(`Untracked ${collection} ${id}`);
  }
}
