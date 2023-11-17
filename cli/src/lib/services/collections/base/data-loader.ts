import { DirectusBaseType, WithSyncIdAndWithoutId } from './interfaces';
import { readJsonSync, writeJsonSync } from 'fs-extra';

export abstract class DataLoader<DirectusType extends DirectusBaseType> {
  constructor(protected readonly filePath: string) {}

  /**
   * Returns the source data from the dump file, using readFileSync
   * and passes it through the data transformer.
   */
  getSourceData(): WithSyncIdAndWithoutId<DirectusType>[] {
    return readJsonSync(
      this.filePath,
    ) as WithSyncIdAndWithoutId<DirectusType>[];
  }

  /**
   * Save the data to the dump file. The data is passed through the data transformer.
   */
  saveData(data: WithSyncIdAndWithoutId<DirectusType>[]) {
    // Sort data by _syncId to avoid git changes
    data.sort(this.getSortFunction());
    writeJsonSync(this.filePath, data, { spaces: 2 });
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
