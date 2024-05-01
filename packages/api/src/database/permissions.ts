import { Knex } from 'knex';
import type { Logger } from 'pino';

interface Permission {
  id: string;
  role: string;
  collection: string;
  action: string;
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
    const roles = await this.getRolesCollectionsAndActions();

    for (const [role, collections] of roles) {
      for (const [collection, actions] of collections) {
        for (const action of actions) {
          const permissions: Permission[] = await this.database(this.tableName)
            .where({ role, collection, action })
            .orderBy('id', 'asc');

          if (permissions.length > 1) {
            // Log the duplicated permissions
            this.logger.warn(
              `Duplicated permissions for role ${role}, collection ${collection}, action ${action} (${permissions.length} permissions)`,
            );

            // Keep the last permission and delete the rest
            const [toKeep, ...rest] = (
              keep === 'first' ? permissions : permissions.reverse()
            ) as [Permission, ...Permission[]];
            const ids = rest.map((permission) => permission.id);
            await this.database(this.tableName).whereIn('id', ids).delete();
            this.logger.info(
              `Deleted ${ids.length} duplicated permissions, keeping permission ${toKeep.id}`,
            );
          }
        }
      }
    }
  }

  protected async getRolesCollectionsAndActions() {
    const permissions: Permission[] = await this.database(this.tableName).where(
      {},
    );
    const roles = new Map<string, Map<string, Set<string>>>();

    for (const permission of permissions) {
      const { role, collection, action } = permission;
      const collections = roles.get(role) ?? new Map<string, Set<string>>();
      const actions = collections.get(collection) ?? new Set<string>();
      actions.add(action);
      collections.set(collection, actions);
      roles.set(role, collections);
    }

    return roles;
  }
}
