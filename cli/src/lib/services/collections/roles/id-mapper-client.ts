import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { ROLES_COLLECTION } from './constants';

@Service()
export class RolesIdMapperClient extends IdMapperClient {
  constructor() {
    super(ROLES_COLLECTION);
  }
}
