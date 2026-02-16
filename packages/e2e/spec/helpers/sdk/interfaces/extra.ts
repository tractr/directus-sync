

// interface OpenAICompatibleHeader {
// 	header: string;
// 	value: string;
// }
// interface OpenAICompatibleModel {
// 	id: string;
// 	name: string;
// 	context?: number;
// 	output?: number;
// 	attachment?: boolean;
// 	reasoning?: boolean;
// 	providerOptions?: { [key: string]: JSONValue };
// }
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
  mcp_enabled: boolean;
  mcp_allow_deletes: boolean;
  mcp_prompts_collection: string | null;
  mcp_system_prompt_enabled: boolean;
  mcp_system_prompt: string | null;
  project_owner: string | null;
  project_usage: string | null;
  org_name: string | null;
  product_updates: boolean;
  project_status: string | null;
  ai_openai_api_key: string | null;
  ai_anthropic_api_key: string | null;
  ai_system_prompt: string | null;
  ai_google_api_key: string | null;
  ai_openai_compatible_api_key: string | null;
  ai_openai_compatible_base_url: string | null;
  ai_openai_compatible_name: string | null;
  ai_openai_compatible_models: Record<string, unknown>[] | null;
  ai_openai_compatible_headers: Record<string, unknown>[] | null;
  ai_openai_allowed_models: string[] | null;
  ai_anthropic_allowed_models: string[] | null;
  ai_google_allowed_models: string[] | null;
  collaborative_editing_enabled: boolean;
}
