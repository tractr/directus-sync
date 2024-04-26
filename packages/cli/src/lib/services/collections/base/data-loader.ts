import { DirectusBaseType, WithSyncIdAndWithoutId } from './interfaces';
import { readJsonSync, writeJsonSync } from 'fs-extra';
import { CollectionHooks } from '../../config';
import { MigrationClient } from '../../migration-client';

export abstract class DataLoader<DirectusType extends DirectusBaseType> {
  constructor(
    protected readonly filePath: string,
    protected readonly migrationClient: MigrationClient,
    protected readonly hooks: CollectionHooks,
  ) {}

  /**
   * Returns the source data from the dump file, using readFileSync
   * and passes it through the data transformer.
   */
  async getSourceData(): Promise<WithSyncIdAndWithoutId<DirectusType>[]> {
    const { onLoad } = this.hooks;
    const loadedData: WithSyncIdAndWithoutId<DirectusType>[] =
      readJsonSync(this.filePath, { throws: false }) || [];
    return onLoad
      ? await onLoad(loadedData, await this.migrationClient.get())
      : loadedData;
  }

  /**
   * Save the data to the dump file. The data is passed through the data transformer.
   */
  async saveData(data: WithSyncIdAndWithoutId<DirectusType>[]) {
    // Sort data by _syncId to avoid git changes
    data.sort(this.getSortFunction());
    const { onSave } = this.hooks;
    const transformedData = onSave
      ? await onSave(data, await this.migrationClient.get())
      : data;
    writeJsonSync(this.filePath, transformedData, { spaces: 2 });
  }

  /**
   * Returns a function to sort the data before saving it.
   */
  protected getSortFunction(): (
    a: WithSyncIdAndWithoutId<DirectusType>,
    b: WithSyncIdAndWithoutId<DirectusType>,
  ) => number {
    return (a, b) => a._syncId.localeCompare(b._syncId);
  }
}
