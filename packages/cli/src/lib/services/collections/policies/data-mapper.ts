import { DataMapper, Field, IdMappers, WithSyncIdAndWithoutId } from '../base';
import { Container, Service } from 'typedi';
import { LoggerService } from '../../logger';
import { POLICIES_COLLECTION } from './constants';
import { DirectusPolicy, DirectusPolicyAccess } from './interfaces';
import { RolesIdMapperClient } from '../roles';
import { ConfigService } from '../../config';

@Service()
export class PoliciesDataMapper extends DataMapper<DirectusPolicy> {
  protected fieldsToIgnore: Field<DirectusPolicy>[];
  protected idMappers: IdMappers<DirectusPolicy>;

  constructor(loggerService: LoggerService, config: ConfigService) {
    super(loggerService.getChild(POLICIES_COLLECTION));

    if (config.shouldSyncPolicyRoles()) {
      this.fieldsToIgnore = ['users', 'permissions'];
      this.idMappers = {
        roles: {
          // @ts-expect-error TODO: Bad SDK Typing
          role: Container.get(RolesIdMapperClient),
        },
      };
    } else {
      this.fieldsToIgnore = ['users', 'permissions', 'roles'];
      this.idMappers = {};
    }
  }

  async mapIdsToSyncIdAndRemoveIgnoredFields(
    items: WithSyncIdAndWithoutId<DirectusPolicy>[],
  ): Promise<WithSyncIdAndWithoutId<DirectusPolicy>[]> {
    const filtered = items.map((item) =>
      Array.isArray(item.roles)
        ? ({
            ...item,
            roles: (item.roles as Partial<DirectusPolicyAccess>[]).filter(
              (a) => !(a.role === null && a.user != null),
            ),
          } as WithSyncIdAndWithoutId<DirectusPolicy>)
        : item,
    );
    return super.mapIdsToSyncIdAndRemoveIgnoredFields(filtered);
  }
}
