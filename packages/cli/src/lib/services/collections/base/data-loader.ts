import { DirectusBaseType, WithSyncIdAndWithoutId } from './interfaces';
import { readJsonSync, writeJsonSync } from 'fs-extra';
import { TransformDataHooks } from '../../config';

export abstract class DataLoader<DirectusType extends DirectusBaseType> {
  constructor(
    protected readonly filePath: string,
    protected readonly transformDataHooks?: TransformDataHooks,
  ) {}

  /**
   * Returns the source data from the dump file, using readFileSync
   * and passes it through the data transformer.
   */
  getSourceData(): WithSyncIdAndWithoutId<DirectusType>[] {
    const onLoad = this.transformDataHooks?.onLoad;
    const loadedData = readJsonSync(
      this.filePath,
    ) as WithSyncIdAndWithoutId<DirectusType>[];
    return onLoad ? onLoad(loadedData) : loadedData;
  }

  /**
   * Save the data to the dump file. The data is passed through the data transformer.
   */
  saveData(data: WithSyncIdAndWithoutId<DirectusType>[]) {
    // Sort data by _syncId to avoid git changes
    data.sort(this.getSortFunction());
    const onSave = this.transformDataHooks?.onSave;
    if (onSave) {
      data = onSave(data);
    }
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
