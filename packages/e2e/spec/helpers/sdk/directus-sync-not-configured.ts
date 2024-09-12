import { DirectusSync } from './directus-sync.js';

export class DirectusSyncNotConfigured extends DirectusSync {
  protected getRequiredArgs(): string[] {
    return [];
  }
}
