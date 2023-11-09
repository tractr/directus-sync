import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { PERMISSIONS_COLLECTION } from './constants';

@Service()
export class PermissionsIdMapperClient extends IdMapperClient {
  constructor() {
    super(PERMISSIONS_COLLECTION);
  }
}
