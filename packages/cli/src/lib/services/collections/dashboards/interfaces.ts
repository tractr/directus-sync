import { DirectusDashboard as BaseDirectusDashboard } from '@directus/sdk';
import { BaseSchema } from '../base';

export type DirectusDashboard = BaseDirectusDashboard<BaseSchema>;
export type DirectusDashboardVirtualFields = 'panels';
