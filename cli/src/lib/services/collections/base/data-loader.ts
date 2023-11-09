import { DirectusBaseType, WithSyncId } from './interfaces';
import { readFileSync, writeFileSync } from 'fs';

export abstract class DataLoader<DirectusType extends DirectusBaseType> {
  // constructor(@Inject('directusDumpPath') protected readonly dumpPath: string) {
  //   this.filePath = path.join(this.dumpPath, `${this.getName()}.json`);
  // }
  constructor(protected readonly filePath: string) {}

  /**
   * Returns a mapping function that is passed to all data after loading from dump.
   * Override this method to transform the data.
   * The default implementation returns the data as is.
   */
  protected getReadDataMapper(): (
    data: WithSyncId<DirectusType>,
  ) => WithSyncId<DirectusType> {
    return function (p1: WithSyncId<DirectusType>) {
      return p1;
    };
  }

  /**
   * Returns a mapping function that is passed to all data before saving to dump.
   * Override this method to transform the data.
   * The default implementation returns the data as is.
   */
  protected getWriteDataMapper(): (
    data: WithSyncId<DirectusType>,
  ) => WithSyncId<DirectusType> {
    return function (p1: WithSyncId<DirectusType>) {
      return p1;
    };
  }

  /**
   * Returns the source data from the dump file, using readFileSync
   * and passes it through the data transformer.
   */
  getSourceData(): WithSyncId<DirectusType>[] {
    const mapper = this.getReadDataMapper();
    const data = JSON.parse(
      String(readFileSync(this.filePath)),
    ) as WithSyncId<DirectusType>[];
    return data.map(mapper);
  }

  /**
   * Save the data to the dump file. The data is passed through the data transformer.
   */
  saveData(data: WithSyncId<DirectusType>[]) {
    const mapper = this.getWriteDataMapper();
    const mappedData = data.map(mapper);
    writeFileSync(this.filePath, JSON.stringify(mappedData, null, 2));
  }
}
