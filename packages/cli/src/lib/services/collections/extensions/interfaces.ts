import { DirectusExtension as BaseDirectusExtension } from '@directus/sdk';
import { BaseSchema } from '../base';

export type DirectusExtension = BaseDirectusExtension<BaseSchema> & { id: string };
