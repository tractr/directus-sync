import { DataMapper, Field, IdMappers } from '../base';
import { Container, Service } from 'typedi';
import { LoggerService } from '../../logger';
import { POLICIES_COLLECTION } from './constants';
import { DirectusPolicy } from './interfaces';
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
}
