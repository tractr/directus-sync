export interface DirectusActivity {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   action: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: string;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   comment: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   ip: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   item: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   origin: string | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   revisions: DirectusRevision[] | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   timestamp: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user: DirectusUser | string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   user_agent: string | null;
}

export interface DirectusCollection {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   accountability: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   archive_app_filter: boolean;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   archive_field: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   archive_value: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collapse: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   color: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   display_template: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   group: DirectusCollection | DirectusCollection["collection"] | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   hidden: boolean;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   item_duplication_fields: any | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   note: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   preview_url: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   singleton: boolean;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   sort_field: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   translations: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   unarchive_value: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   versioning: boolean;
}

export interface DirectusDashboard {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   color: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   note: string | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   panels: DirectusPanel[] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusExtension {

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   enabled: boolean;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;
}

export interface DirectusField {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: DirectusCollection | string;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   conditions: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   display: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   display_options: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   field: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   group: DirectusField | string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   hidden: boolean;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   interface: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   note: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   options: any | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   readonly: boolean;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   required: boolean | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: csv
   * Type in database: character varying
   */
   special: string[] | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   translations: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   validation: any | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   validation_message: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   width: string | null;
}

export interface DirectusFile {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   charset: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   description: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   duration: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   embed: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   filename_disk: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   filename_download: string;

  /**
   * No description.
   *
   * Type in directus: bigInteger
   * Type in database: bigint
   */
   filesize: number | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   folder: DirectusFolder | DirectusFolder["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   height: number | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   location: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   metadata: any | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   modified_by: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   modified_on: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   storage: string;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: text
   */
   tags: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   title: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   type: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   uploaded_by: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   uploaded_on: string;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   width: number | null;
}

export interface DirectusFlow {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   accountability: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   color: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   description: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   operation: DirectusOperation | string | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   operations: DirectusOperation[] | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   options: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   trigger: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusFolder {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   parent: DirectusFolder | DirectusFolder["id"] | null;
}

export interface DirectusMigration {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   timestamp: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   version: string;
}

export interface DirectusNotification {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   item: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   message: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   recipient: DirectusUser | DirectusUser["id"];

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   sender: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   subject: string;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   timestamp: string | null;
}

export interface DirectusOperation {

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   flow: DirectusFlow | DirectusFlow["id"];

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   key: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   options: any | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   position_x: number;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   position_y: number;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   reject: DirectusOperation | DirectusOperation["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   resolve: DirectusOperation | DirectusOperation["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   type: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusPanel {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   color: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   dashboard: DirectusDashboard | DirectusDashboard["id"];

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   height: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   note: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   options: any | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   position_x: number;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   position_y: number;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   show_header: boolean;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   type: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   width: number;
}

export interface DirectusPermission {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   action: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: string;

  /**
   * No description.
   *
   * Type in directus: csv
   * Type in database: text
   */
   fields: string[] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   permissions: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   presets: any | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   role: DirectusRole | DirectusRole["id"] | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   validation: any | null;
}

export interface DirectusPreset {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   bookmark: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   color: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   filter: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   layout: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   layout_options: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   layout_query: any | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   refresh_interval: number | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   role: DirectusRole | DirectusRole["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   search: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusRelation {

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   junction_field: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   many_collection: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   many_field: string;

  /**
   * No description.
   *
   * Type in directus: csv
   * Type in database: text
   */
   one_allowed_collections: string[] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   one_collection: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   one_collection_field: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   one_deselect_action: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   one_field: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   sort_field: string | null;
}

export interface DirectusRevision {

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   activity: DirectusActivity | DirectusActivity["id"];

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: string;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   data: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   delta: any | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   item: string;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   parent: DirectusRevision | DirectusRevision["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   version: DirectusVersion | DirectusVersion["id"] | null;
}

export interface DirectusRole {

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   admin_access: boolean;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   app_access: boolean;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   description: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   enforce_tfa: boolean;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: csv
   * Type in database: text
   */
   ip_access: string[] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   users: DirectusUser[] | null;
}

export interface DirectusSession {

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   expires: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   ip: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   origin: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   share: DirectusShare | DirectusShare["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   token: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   user_agent: string | null;
}

export interface DirectusSetting {

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   auth_login_attempts: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   auth_password_policy: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   basemaps: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   custom_aspect_ratios: any | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   custom_css: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   default_appearance: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   default_language: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   default_theme_dark: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   default_theme_light: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   mapbox_key: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   module_bar: any | null;

  /**
   * $t:field_options.directus_settings.project_color_note
   *
   * Type in directus: string
   * Type in database: character varying
   */
   project_color: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   project_descriptor: string | null;

  /**
   * $t:field_options.directus_settings.project_logo_note
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   project_logo: DirectusFile | DirectusFile["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   project_name: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   project_url: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   public_background: DirectusFile | DirectusFile["id"] | null;

  /**
   * $t:field_options.directus_settings.project_favicon_note
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   public_favicon: DirectusFile | DirectusFile["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   public_foreground: DirectusFile | DirectusFile["id"] | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   public_note: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   storage_asset_presets: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   storage_asset_transform: string | null;

  /**
   * $t:interfaces.system-folder.field_hint
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   storage_default_folder: DirectusFolder | DirectusFolder["id"] | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   theme_dark_overrides: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   theme_light_overrides: any | null;
}

export interface DirectusShare {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: DirectusCollection | DirectusCollection["collection"];

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * $t:shared_leave_blank_for_unlimited
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_end: string | null;

  /**
   * $t:shared_leave_blank_for_unlimited
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_start: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   item: string;

  /**
   * $t:shared_leave_blank_for_unlimited
   *
   * Type in directus: integer
   * Type in database: integer
   */
   max_uses: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string | null;

  /**
   * $t:shared_leave_blank_for_passwordless_access
   *
   * Type in directus: hash
   * Type in database: character varying
   */
   password: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   role: DirectusRole | DirectusRole["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   times_used: number | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusSyncIdMap {

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   created_at: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   local_id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   sync_id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   table: string;
}

export interface DirectusTranslation {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   key: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   language: string;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   value: string;
}

export interface DirectusUser {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   appearance: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   auth_data: any | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   avatar: DirectusFile | string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   description: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   email: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   email_notifications: boolean | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   external_identifier: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   first_name: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   language: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   last_access: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   last_name: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   last_page: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   location: string | null;

  /**
   * No description.
   *
   * Type in directus: hash
   * Type in database: character varying
   */
   password: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   provider: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   role: DirectusRole | DirectusRole["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: string;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   tags: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   tfa_secret: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   theme_dark: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   theme_dark_overrides: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   theme_light: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   theme_light_overrides: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   title: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   token: string | null;
}

export interface DirectusVersion {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: DirectusCollection | DirectusCollection["collection"];

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   hash: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   item: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   key: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusWebhook {

  /**
   * No description.
   *
   * Type in directus: csv
   * Type in database: character varying
   */
   actions: string[];

  /**
   * No description.
   *
   * Type in directus: csv
   * Type in database: character varying
   */
   collections: string[];

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   data: boolean;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   headers: any | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   method: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   url: string;
}


export type Collections = {
  directus_activity: DirectusActivity[];
  directus_collections: DirectusCollection[];
  directus_dashboards: DirectusDashboard[];
  directus_extensions: DirectusExtension[];
  directus_fields: DirectusField[];
  directus_files: DirectusFile[];
  directus_flows: DirectusFlow[];
  directus_folders: DirectusFolder[];
  directus_migrations: DirectusMigration[];
  directus_notifications: DirectusNotification[];
  directus_operations: DirectusOperation[];
  directus_panels: DirectusPanel[];
  directus_permissions: DirectusPermission[];
  directus_presets: DirectusPreset[];
  directus_relations: DirectusRelation[];
  directus_revisions: DirectusRevision[];
  directus_roles: DirectusRole[];
  directus_sessions: DirectusSession[];
  directus_settings: DirectusSetting;
  directus_shares: DirectusShare[];
  directus_sync_id_map: DirectusSyncIdMap[];
  directus_translations: DirectusTranslation[];
  directus_users: DirectusUser[];
  directus_versions: DirectusVersion[];
  directus_webhooks: DirectusWebhook[];
}


export type CollectionName = keyof Collections;

export type ItemIn<CollectionKey extends CollectionName> =
    Collections[CollectionKey] extends (infer Item extends Record<string, any>)[]
        ? Item
        : Collections[CollectionKey]

