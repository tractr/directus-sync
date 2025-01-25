import { Inject, Service } from 'typedi';
import { LOGGER } from '../../../constants';
import { DIRECTUS_COLLECTIONS_PREFIX } from '../constants';
import { getChildLogger } from '../../../helpers';
import pino from 'pino';
import { Cacheable } from 'typescript-cacheable';
import { SnapshotClient, Type } from '../../snapshot';
import {
  DirectusNativeStructure,
  SupportedDirectusCollections,
} from './directus-structure';

// Re-export the enum for easier access
export { Type };

@Service({ global: true })
export class SchemaClient {
  protected readonly logger: pino.Logger;

  constructor(
    @Inject(LOGGER) protected readonly baseLogger: pino.Logger,
    protected readonly snapshotClient: SnapshotClient,
  ) {
    this.logger = getChildLogger(baseLogger, 'schema-client');
  }

  /**
   * Returns the list of fields of type "many-to-one" of a model.
   */
  @Cacheable()
  async getRelationFields(model: string): Promise<string[]> {
    if (this.isDirectusCollection(model)) {
      return this.getDirectusCollectionRelationFields(model);
    }
    const snapshot = await this.snapshotClient.getSnapshot();
    return snapshot.relations
      .filter((r) => r.collection === model)
      .map((r) => r.field);
  }

  /**
   * Returns the target model of a many-to-one relation.
   * Throw an error if the relation is not many-to-one
   * or the model does not exist or the field does not exist.
   */
  @Cacheable()
  async getTargetModel(model: string, field: string): Promise<string> {
    if (this.isDirectusCollection(model)) {
      const relation = this.getDirectusCollectionTargetModel(model, field);
      if (!relation) {
        throw new Error(
          `Relation ${model}.${field} does not exist in the Directus structure`,
        );
      }
      return relation;
    }
    const snapshot = await this.snapshotClient.getSnapshot();
    const relation = snapshot.relations.find(
      (r) => r.collection === model && r.field === field,
    );
    if (!relation) {
      throw new Error(
        `Relation ${model}.${field} does not exist in the snapshot`,
      );
    }
    return relation.related_collection;
  }

  /**
   * Returns the primary field of a model.
   */
  @Cacheable()
  async getPrimaryField(model: string): Promise<{ name: string; type: Type }> {
    if (this.isDirectusCollection(model)) {
      return this.getDirectusCollectionPrimaryField(model);
    }
    const snapshot = await this.snapshotClient.getSnapshot();
    const fields = snapshot.fields.filter((c) => c.collection === model);
    const primaryField = fields.find((f) => f.schema?.is_primary_key);
    if (!primaryField) {
      throw new Error(`Primary field not found in ${model}`);
    }
    return { name: primaryField.field, type: primaryField.type };
  }

  /**
   * Denotes if the collection is a directus collection.
   */
  protected isDirectusCollection(
    collection: string,
  ): collection is SupportedDirectusCollections {
    if (collection.startsWith(DIRECTUS_COLLECTIONS_PREFIX)) {
      if (
        !SupportedDirectusCollections.includes(
          collection as SupportedDirectusCollections,
        )
      ) {
        throw new Error(
          `Unsupported Directus collection by seed command: ${collection}. Supported collections are: ${SupportedDirectusCollections.join(', ')}`,
        );
      }
      return true;
    }
    return false;
  }

  /**
   * Returns the list of fields of type "many-to-one" of a directus collection.
   */
  protected getDirectusCollectionRelationFields(
    model: SupportedDirectusCollections,
  ): string[] {
    const structure = DirectusNativeStructure[model];
    return structure.relations.map((r) => r.field);
  }

  /**
   * Returns the target model of a directus collection.
   */
  protected getDirectusCollectionTargetModel(
    model: SupportedDirectusCollections,
    field: string,
  ): string | undefined {
    const structure = DirectusNativeStructure[model];
    return structure.relations.find((r) => r.field === field)?.collection;
  }

  /**
   * Returns the primary field type of a directus model.
   */
  protected getDirectusCollectionPrimaryField(
    model: SupportedDirectusCollections,
  ): {
    name: string;
    type: Type;
  } {
    const structure = DirectusNativeStructure[model];
    return structure.primaryField;
  }
}
