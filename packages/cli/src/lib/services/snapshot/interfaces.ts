/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RawSchemaDiffOutput {
  hash: string;
  diff: Record<string, any>;
}

export interface SchemaDiffOutput {
  hash: string;
  diff: SnapshotDiffDiff | null | undefined;
}

export interface SnapshotDiffDiff {
  collections: unknown[];
  fields: unknown[];
  relations: unknown[];
}

export interface Snapshot {
  version: number;
  directus: string;
  vendor: string;
  collections: Collection[];
  fields: Field[];
  relations: Relation[];
}

export interface Collection {
  collection: string;
  meta: CollectionMeta;
  schema?: CollectionSchema;
}

export interface CollectionMeta {
  accountability: Accountability;
  archive_app_filter: boolean;
  archive_field: null | string;
  archive_value: null | string;
  collapse: Collapse;
  collection: string;
  color: null;
  display_template: null | string;
  group: Group | null;
  hidden: boolean;
  icon: null | string;
  item_duplication_fields: string[] | null;
  note: null;
  preview_url: null | string;
  singleton: boolean;
  sort: number | null;
  sort_field: null;
  translations: null;
  unarchive_value: null | string;
  versioning: boolean;
}

export enum Accountability {
  All = 'all',
}

export enum Collapse {
  Open = 'open',
}

export enum Group {
  Banking = 'Banking',
  Business = 'Business',
  Gamification = 'Gamification',
}

export interface CollectionSchema {
  name: string;
}

export interface Field {
  collection: string;
  field: string;
  type: Type;
  meta: FieldMeta | null;
  schema?: FieldSchema;
}

export interface FieldMeta {
  collection: string;
  conditions: null;
  display: Display | null;
  display_options: DisplayOptions | null;
  field: string;
  group: null | string;
  hidden: boolean;
  interface: null | string;
  note: null | string;
  options: Options | null;
  readonly: boolean;
  required: boolean;
  sort: number;
  special: string[] | null;
  translations: null;
  validation: null;
  validation_message: null;
  width: Width;
}

export enum Display {
  Boolean = 'boolean',
  Datetime = 'datetime',
  FormattedValue = 'formatted-value',
  Labels = 'labels',
  Raw = 'raw',
  RelatedValues = 'related-values',
  User = 'user',
}

export interface DisplayOptions {
  font?: string;
  relative?: boolean;
  format?: boolean | string;
  colorOff?: string;
  colorOn?: string;
  iconOff?: string;
  iconOn?: string;
  template?: string;
  choices?: DisplayOptionsChoice[];
  suffix?: string;
  labelOff?: string;
  labelOn?: string;
}

export interface DisplayOptionsChoice {
  text: string;
  value: string;
  foreground: string;
  background?: string;
}

export interface Options {
  font?: string;
  iconLeft?: null;
  iconRight?: string;
  storeMasked?: boolean;
  template?: Template | null;
  templateType?: string;
  trim?: boolean;
  label?: string;
  enableCreate?: boolean;
  choices?: OptionsChoice[];
  icon?: string;
  crop?: boolean;
  folder?: string;
  headerIcon?: string;
  transform?: string;
  max?: number | null;
  min?: number;
  toolbar?: string[];
  step?: number;
  color?: string;
  text?: string;
  defaultView?: DefaultView;
  geometryType?: string;
  placeholder?: null;
  includeSeconds?: boolean;
}

export interface OptionsChoice {
  text: string;
  value: number | string;
}

export interface DefaultView {
  bearing: number;
  center: Center;
  pitch: number;
  zoom: number;
}

export interface Center {
  lat: number;
  lng: number;
}

export enum Template {
  AvatarThumbnailFirstNameLastName = '{{avatar.$thumbnail}} {{first_name}} {{last_name}}',
  D4D4D4D4 = '\\d{4} \\d{4} \\d{4} \\d{4}',
  FirstNameLastNameEmployerName = '{{first_name}}{{last_name}} ({{employer.name}})',
  The09 = '([0-9\\ \\+]+)',
}

export enum Width {
  Full = 'full',
  Half = 'half',
}

export interface FieldSchema {
  name: string;
  table: string;
  data_type: DataType;
  default_value: boolean | number | null | string;
  max_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
  is_nullable: boolean;
  is_unique: boolean;
  is_primary_key: boolean;
  is_generated: boolean;
  generation_expression: null;
  has_auto_increment: boolean;
  foreign_key_table: null | string;
  foreign_key_column: ForeignKeyColumn | null;
}

export enum DataType {
  Boolean = 'boolean',
  CharacterVarying = 'character varying',
  Integer = 'integer',
  Numeric = 'numeric',
  Point = 'POINT',
  Text = 'text',
  TimestampWithTimeZone = 'timestamp with time zone',
  TimestampWithoutTimeZone = 'timestamp without time zone',
  UUID = 'uuid',
}

export enum ForeignKeyColumn {
  ID = 'id',
}

export enum Type {
  Alias = 'alias',
  Boolean = 'boolean',
  DateTime = 'dateTime',
  Decimal = 'decimal',
  GeometryPoint = 'geometry.Point',
  Integer = 'integer',
  String = 'string',
  Text = 'text',
  Timestamp = 'timestamp',
  UUID = 'uuid',
}

export interface Relation {
  collection: string;
  field: string;
  related_collection: string;
  meta: RelationMeta;
  schema: RelationSchema;
}

export interface RelationMeta {
  junction_field: null | string;
  many_collection: string;
  many_field: string;
  one_allowed_collections: null;
  one_collection: string;
  one_collection_field: null;
  one_deselect_action: OneDeselectAction;
  one_field: null | string;
  sort_field: null;
}

export enum OneDeselectAction {
  Delete = 'delete',
  Nullify = 'nullify',
}

export interface RelationSchema {
  table: string;
  column: string;
  foreign_key_table: string;
  foreign_key_column: ForeignKeyColumn;
  constraint_name: string;
  on_update: On;
  on_delete: On;
}

export enum On {
  Cascade = 'CASCADE',
  NoAction = 'NO ACTION',
  SetNull = 'SET NULL',
}
