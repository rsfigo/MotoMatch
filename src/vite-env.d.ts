/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Öffentliche Adresse ohne «/» am Ende, z. B. https://motomatch.example (optional) */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
