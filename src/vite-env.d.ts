/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_LEADS_FUNCTION_URL?: string
  readonly VITE_SUPABASE_CREATE_LEAD_FUNCTION_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
