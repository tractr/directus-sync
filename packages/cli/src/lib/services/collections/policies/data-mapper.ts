import { DataMapper, Field, IdMappers } from '../base';
import { Container, Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { POLICIES_COLLECTION } from './constants';
import { DirectusPolicy } from './interfaces';
import { RolesIdMapperClient } from '../roles';

@Service()
export class PoliciesDataMapper extends DataMapper<DirectusPolicy> {
  protected fieldsToIgnore: Field<DirectusPolicy>[] = ['users', 'permissions'];
  protected idMappers: IdMappers<DirectusPolicy> = {
    roles: {
      // @ts-ignore TODO: Bad SDK Typing
      role: Container.get(RolesIdMapperClient),
    },
  };

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, POLICIES_COLLECTION));
  }
}
