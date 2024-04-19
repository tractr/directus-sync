export interface DirectusSettingsExtra {
  default_appearance: 'light' | 'dark';
  default_theme_light: string | null;
  theme_light_overrides: Record<string, string>;
  theme_dark_overrides: Record<string, string>;
  default_theme_dark: string | null;
  report_error_url: string | null;
  report_bug_url: string | null;
  report_feature_url: string | null;
}
