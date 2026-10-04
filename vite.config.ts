/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { preloadDataPlugin } from './scripts/preloadDataPlugin.ts';
import { seoPlugin } from './scripts/seoPlugin.ts';
import { isSecretKey } from './src/data/db/keys.ts';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  // Schutz: VITE_-Variablen landen im Browser. Steckt darin ein geheimer Supabase-Schlüssel,
  // bricht der Build ab, bevor er veröffentlicht werden kann.
  const leaked = Object.keys(env).filter((name) => isSecretKey(env[name] ?? ''));
  if (leaked.length > 0) {
    throw new Error(
      `${leaked.join(', ')} enthält einen geheimen Supabase-Schlüssel. In VITE_-Variablen ` +
        'gehört nur der öffentliche Schlüssel; den geheimen im Supabase-Dashboard neu erzeugen.',
    );
  }

  // Öffentliche Adresse der Website (optional, siehe .env.example und scripts/seoPlugin.ts)
  const { VITE_SITE_URL } = env;

  // Datenquelle wie in src/lib/repository.ts; im Supabase-Modus die Verbindung früh aufbauen
  const supabaseUrl = env.VITE_DATA_SOURCE === 'supabase' ? env.VITE_SUPABASE_URL : undefined;
  if (supabaseUrl && !URL.canParse(supabaseUrl)) {
    throw new Error(
      'VITE_SUPABASE_URL ist keine gültige Adresse (erwartet: https://<projekt-id>.supabase.co).',
    );
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      seoPlugin({
        siteUrl: VITE_SITE_URL,
        modelsDir: fileURLToPath(new URL('./src/data/models', import.meta.url)),
        imageAlt: 'MotoMatch – Motorräder für die Schweiz vergleichen',
      }),
      preloadDataPlugin({
        chunkNames: ['jsonRepository', 'supabaseRepository'],
        preconnect: supabaseUrl,
      }),
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    test: {
      // Getestet wird nur reine Logik (src/lib, src/data) – dafür reicht die Node-Umgebung.
      include: ['src/**/*.test.ts'],
      environment: 'node',
    },
  };
});
