export interface DirectusSettingsExtra {
  default_appearance: 'light' | 'dark';
  default_theme_light: string | null;
  theme_light_overrides: Record<string, string>;
  theme_dark_overrides: Record<string, string>;
  default_theme_dark: string | null;
  public_registration: boolean;
  public_registration_verify_email: boolean;
  public_registration_role: string | null;
  public_registration_email_filter: object | string | null;
  visual_editor_urls: string[] | null;
}
