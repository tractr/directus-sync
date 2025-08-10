import { DataMapper, Field, IdMappers } from '../base';
import { Container, Service } from 'typedi';
import { LoggerService } from '../../logger';
import { PoliciesIdMapperClient } from '../policies';
import { PERMISSIONS_COLLECTION } from './constants';
import { DirectusPermission } from './interfaces';

@Service()
export class PermissionsDataMapper extends DataMapper<DirectusPermission> {
  protected fieldsToIgnore: Field<DirectusPermission>[] = [];
  protected idMappers: IdMappers<DirectusPermission> = {
    policy: Container.get(PoliciesIdMapperClient),
  };

  constructor(loggerService: LoggerService) {
    super(loggerService.getChild(PERMISSIONS_COLLECTION));
  }
}
