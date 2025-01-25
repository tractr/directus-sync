import { Inject, Service } from 'typedi';
import { LOGGER, DIRECTUS_COLLECTIONS_PREFIX } from '../../../constants';
import { getChildLogger } from '../../../helpers';
import pino from 'pino';
import { Cacheable } from 'typescript-cacheable';
import { SnapshotClient, Field, Type } from '../../snapshot';

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
   * Returns the list of fields of a model.
   */
  @Cacheable()
  async getFields(model: string): Promise<Field[]> {
    const snapshot = await this.snapshotClient.getSnapshot();
    return snapshot.fields.filter((f) => f.collection === model);
  }

  /**
   * Returns the list of fields of type "many-to-one" of a model.
   */
  @Cacheable()
  async getRelationFields(model: string): Promise<string[]> {
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
    if (model.startsWith(DIRECTUS_COLLECTIONS_PREFIX)) {
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
   * Returns the primary field type of a directus model.
   */
  protected getDirectusCollectionPrimaryField(model: string): {
    name: string;
    type: Type;
  } {
    if (['directus_permissions', 'directus_presets'].includes(model)) {
      return { name: 'id', type: Type.Integer };
    }
    return { name: 'id', type: Type.UUID };
  }
}
