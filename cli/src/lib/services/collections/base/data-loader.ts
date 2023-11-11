import { DirectusBaseType, WithSyncIdAndWithoutId } from './interfaces';
import { readFileSync, writeFileSync } from 'fs-extra';

export abstract class DataLoader<DirectusType extends DirectusBaseType> {
  constructor(protected readonly filePath: string) {}

  /**
   * Returns the source data from the dump file, using readFileSync
   * and passes it through the data transformer.
   */
  getSourceData(): WithSyncIdAndWithoutId<DirectusType>[] {
    return JSON.parse(
      String(readFileSync(this.filePath)),
    ) as WithSyncIdAndWithoutId<DirectusType>[];
  }

  /**
   * Save the data to the dump file. The data is passed through the data transformer.
   */
  saveData(data: WithSyncIdAndWithoutId<DirectusType>[]) {
    writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }
}
