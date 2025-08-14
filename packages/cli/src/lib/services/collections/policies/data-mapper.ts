import { DataMapper, Field, IdMappers } from '../base';
import { Container, Service } from 'typedi';
import { LoggerService } from '../../logger';
import { POLICIES_COLLECTION } from './constants';
import { DirectusPolicy } from './interfaces';
import { RolesIdMapperClient } from '../roles';

@Service()
export class PoliciesDataMapper extends DataMapper<DirectusPolicy> {
  protected fieldsToIgnore: Field<DirectusPolicy>[] = ['users', 'permissions'];
  protected idMappers: IdMappers<DirectusPolicy> = {
    roles: {
      // @ts-expect-error TODO: Bad SDK Typing
      role: Container.get(RolesIdMapperClient),
    },
  };

  constructor(loggerService: LoggerService) {
    super(loggerService.getChild(POLICIES_COLLECTION));
  }
}
