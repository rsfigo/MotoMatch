/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { seoPlugin } from './scripts/seoPlugin.ts';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Öffentliche Adresse der Website (optional, siehe .env.example und scripts/seoPlugin.ts)
  const { VITE_SITE_URL } = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [
      react(),
      tailwindcss(),
      seoPlugin({
        siteUrl: VITE_SITE_URL,
        modelsDir: fileURLToPath(new URL('./src/data/models', import.meta.url)),
        imageAlt: 'MotoMatch – Motorräder für die Schweiz vergleichen',
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
