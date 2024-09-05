import { Knex } from 'knex';
import type { Logger } from 'pino';

interface Permission {
  id: string;
  policy: string;
  collection: string;
  action: string;
}

interface DeletedPermission {
  policy: string;
  collection: string;
  action: string;
  ids: string[];
}

export class Permissions {
  protected readonly tableName = 'directus_permissions';

  constructor(
    protected readonly database: Knex,
    protected readonly logger: Logger,
  ) {}

  /**
   * Remove duplicated permissions
   */
  async removeDuplicates(keep: 'first' | 'last') {
    const policies = await this.getPoliciesCollectionsAndActions();
    const output: DeletedPermission[] = [];

    for (const [policy, collections] of policies) {
      for (const [collection, actions] of collections) {
        for (const action of actions) {
          const permissions: Permission[] = await this.database(this.tableName)
            .where({ policy, collection, action })
            .orderBy('id', 'asc');

          if (permissions.length > 1) {
            // Log the duplicated permissions
            this.logger.warn(
              `Duplicated permissions for policy ${policy}, collection ${collection}, action ${action} (${permissions.length} permissions)`,
            );

            // Keep the last permission and delete the rest
            const [toKeep, ...rest] = (
              keep === 'first' ? permissions : permissions.reverse()
            ) as [Permission, ...Permission[]];

            const ids = rest.map((permission) => permission.id);
            await this.database(this.tableName).whereIn('id', ids).delete();

            output.push({ policy, collection, action, ids });
            this.logger.info(
              `Deleted ${ids.length} duplicated permissions, keeping permission ${toKeep.id}`,
            );
          }
        }
      }
    }

    return output;
  }

  protected async getPoliciesCollectionsAndActions() {
    const permissions: Permission[] = await this.database(this.tableName).where(
      {},
    );
    const policies = new Map<string, Map<string, Set<string>>>();

    for (const permission of permissions) {
      const { policy, collection, action } = permission;
      const collections =
        policies.get(policy) ?? new Map<string, Set<string>>();
      const actions = collections.get(collection) ?? new Set<string>();
      actions.add(action);
      collections.set(collection, actions);
      policies.set(policy, collections);
    }

    return policies;
  }
}
