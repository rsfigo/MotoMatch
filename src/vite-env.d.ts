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
  /** Betreiber für Impressum und Datenschutz (öffentlich, aber nicht im Repository) */
  readonly VITE_OPERATOR_NAME?: string;
  /** Postadresse des Betreibers, kein Postfach */
  readonly VITE_OPERATOR_ADDRESS?: string;
  /** E-Mail-Adresse des Betreibers */
  readonly VITE_OPERATOR_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
