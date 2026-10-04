/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Öffentliche Adresse ohne «/» am Ende, z. B. https://motomatch.example (optional) */
  readonly VITE_SITE_URL?: string;
  /** Datenquelle: «json» (Standard) oder «supabase» */
  readonly VITE_DATA_SOURCE?: string;
  /** Adresse des Supabase-Projekts (nur bei VITE_DATA_SOURCE=supabase) */
  readonly VITE_SUPABASE_URL?: string;
  /** Öffentlicher Schlüssel (publishable bzw. anon) – nie der geheime Schlüssel */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
