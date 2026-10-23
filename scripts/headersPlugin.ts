/**
 * Sicherheits- und Cache-Header beim Build
 * ----------------------------------------
 * Schreibt dist/_headers für Cloudflare (Inhalt in scripts/lib/headers.ts). Die Content
 * Security Policy hängt vom Build ab: Sie erlaubt das Theme-Skript in index.html über seinen
 * Hash und im Supabase-Modus Anfragen an die Supabase-API.
 *
 * Lokal so prüfen, wie Cloudflare ausliefert: npm run build, dann npx wrangler dev.
 */
import type { Plugin } from 'vite';
import { contentSecurityPolicy, headersFile, inlineScriptHashes } from './lib/headers.ts';

export function headersPlugin({ supabaseUrl }: { supabaseUrl: string | undefined }): Plugin {
  return {
    name: 'motomatch-headers',
    apply: 'build',

    generateBundle: {
      // Nach den übrigen Plugins: Erst dann liegt die fertige index.html im Bundle.
      order: 'post',
      handler(_options, bundle) {
        const html = bundle['index.html'];
        if (html?.type !== 'asset' || typeof html.source !== 'string') {
          this.error('index.html fehlt im Build – die Header lassen sich nicht erzeugen.');
        }
        const csp = contentSecurityPolicy({
          scriptHashes: inlineScriptHashes(html.source),
          connectOrigins: supabaseUrl ? [new URL(supabaseUrl).origin] : [],
        });
        this.emitFile({ type: 'asset', fileName: '_headers', source: headersFile(csp) });
      },
    },
  };
}
