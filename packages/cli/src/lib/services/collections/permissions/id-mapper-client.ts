import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { PERMISSIONS_COLLECTION } from './constants';
import { ConfigService } from '../../config';

@Service()
export class PermissionsIdMapperClient extends IdMapperClient {
  constructor(config: ConfigService) {
    super(config, PERMISSIONS_COLLECTION);
  }
}
