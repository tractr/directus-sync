import { DirectusSettings } from '@directus/sdk';
import { faker } from '@faker-js/faker';
import { DirectusSettingsExtra } from '../../sdk/index.js';

export function getSettings(): Omit<
  DirectusSettings<object>,
  | 'id'
  | 'project_logo'
  | 'public_foreground'
  | 'public_background'
  | 'public_favicon'
  | 'project_url'
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
  };
}
