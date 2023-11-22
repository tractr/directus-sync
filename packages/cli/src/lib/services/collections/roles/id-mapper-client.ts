import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { ROLES_COLLECTION } from './constants';
import { ConfigService } from '../../config';

@Service()
export class RolesIdMapperClient extends IdMapperClient {
  constructor(config: ConfigService) {
    super(config, ROLES_COLLECTION);
  }
}
