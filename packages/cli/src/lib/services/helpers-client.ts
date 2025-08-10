import { ExtensionClient } from './extension-client';
import { MigrationClient } from './migration-client';
import { Service } from 'typedi';
import { ConfigService } from './config';
import { LoggerService, Logger } from './logger';

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
}
