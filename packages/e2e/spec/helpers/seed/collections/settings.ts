import { DirectusSettings } from '@directus/sdk';
import { faker } from '@faker-js/faker';
import { DirectusSettingsExtra, Schema } from '../../sdk/index.js';
import { v } from '@faker-js/faker/dist/airline-CLphikKp.js';

export function getSettings(
  publicRole: string | null = null,
): Omit<
  DirectusSettings<Schema>,
  | 'id'
  | 'project_logo'
  | 'public_foreground'
  | 'public_background'
  | 'public_favicon'
  | 'project_url'
  | 'project_id'
> &
  DirectusSettingsExtra {
  return {
    project_name: faker.lorem.word(),
    project_color: '#6644FF',
    public_note: faker.lorem.sentence({ min: 3, max: 5 }),
    auth_login_attempts: faker.number.int({ min: 5, max: 50 }),
    auth_password_policy: '/^.{8,}$/',
    storage_asset_transform: 'none',
    storage_asset_presets: null,
    custom_css:
      'body {\n  --v-button-background-color: #6644FF !important;\n}\n',
    storage_default_folder: null,
    basemaps: null,
    mapbox_key: faker.string.alphanumeric(32),
    module_bar: null,
    project_descriptor: 'Test project',
    default_language: 'en-US',
    custom_aspect_ratios: null,
    default_appearance: 'light',
    default_theme_light: 'Directus Default',
    theme_light_overrides: {
      borderRadius: '2px',
    },
    default_theme_dark: null,
    theme_dark_overrides: {
      borderRadius: '1px',
    },
    report_error_url: faker.internet.url(),
    report_bug_url: faker.internet.url(),
    report_feature_url: faker.internet.url(),
    public_registration: faker.datatype.boolean(),
    public_registration_verify_email: faker.datatype.boolean(),
    public_registration_role: publicRole,
    public_registration_email_filter: {
      _and: [
        {
          email: {
            _ends_with: `@${faker.internet.domainName()}`,
          },
        },
      ],
    },
    visual_editor_urls: [faker.internet.url()],
    mcp_enabled: faker.datatype.boolean(),
    mcp_allow_deletes: faker.datatype.boolean(),
    mcp_prompts_collection: faker.lorem.word(),
    mcp_system_prompt_enabled: faker.datatype.boolean(),
    mcp_system_prompt: faker.lorem.sentence({ min: 6, max: 10 }),
    project_owner: faker.internet.email(),
    project_usage: faker.lorem.word(),
    org_name: faker.lorem.word(),
    product_updates: faker.datatype.boolean(),
    project_status: faker.lorem.word(),
    ai_openai_api_key: faker.string.alphanumeric(32),
    ai_anthropic_api_key: faker.string.alphanumeric(32),
    ai_system_prompt: faker.lorem.sentence({ min: 6, max: 10 }),
    ai_google_api_key: faker.string.alphanumeric(32),
    ai_openai_compatible_api_key: faker.string.alphanumeric(32),
    ai_openai_compatible_base_url: faker.internet.url(),
    ai_openai_compatible_name: faker.lorem.word(),
    ai_openai_compatible_models: [
      {
        id: faker.string.alphanumeric(32),
        name: faker.lorem.word(),
        context: faker.number.int({ min: 1, max: 10 }),
        output: faker.number.int({ min: 1, max: 10 }),
        attachment: faker.datatype.boolean(),
        reasoning: faker.datatype.boolean(),
        providerOptions: {
          [faker.lorem.word()]: faker.lorem.word(),
        },
      },
    ],
    ai_openai_compatible_headers: [
      {
        header: faker.lorem.word(),
        value: faker.lorem.word(),
      },
    ],
    ai_openai_allowed_models: [faker.lorem.word()],
    ai_anthropic_allowed_models: [faker.lorem.word()],
    ai_google_allowed_models: [faker.lorem.word()],
    collaborative_editing_enabled: faker.datatype.boolean(),
  };
}
