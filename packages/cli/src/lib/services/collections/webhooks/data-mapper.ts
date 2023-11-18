import {DataMapper} from '../base';

import {Inject, Service} from 'typedi';
import pino from 'pino';
import {getChildLogger} from '../../../helpers';
import {LOGGER} from '../../../constants';
import {WEBHOOKS_COLLECTION} from './constants';
import {DirectusWebhook} from "./interfaces";

@Service()
export class WebhooksDataMapper extends DataMapper<DirectusWebhook> {
  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, WEBHOOKS_COLLECTION));
  }
}
