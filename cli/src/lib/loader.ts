import { SettingsCollection, WebhooksCollection } from './directus-collections';

export function loadCollections() {
  return [new WebhooksCollection(), new SettingsCollection()];
}
