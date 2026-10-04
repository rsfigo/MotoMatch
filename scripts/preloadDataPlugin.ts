/**
 * Vite-Plugin: Die Datenquelle früh laden
 * ---------------------------------------
 * Die Daten stecken in einem eigenen Chunk (jsonRepository bzw. supabaseRepository, siehe
 * src/lib/repository.ts). Ohne Hinweis fragt der Browser ihn erst an, wenn das Haupt-Bundle
 * läuft – eine zusätzliche Runde im Netz vor dem ersten Inhalt (LCP). Das Plugin ergänzt beim
 * Build ein <link rel="modulepreload"> für diesen Chunk und im Supabase-Modus ein
 * <link rel="preconnect"> zur Daten-API.
 */
import type { HtmlTagDescriptor, Plugin } from 'vite';

interface PreloadDataOptions {
  /** Namen der Chunks, die vorgeladen werden, sofern sie im Build vorkommen */
  chunkNames: string[];
  /** Adresse, zu der die Verbindung früh aufgebaut wird (z. B. die Supabase-Projekt-URL) */
  preconnect?: string;
}

export function preloadDataPlugin({ chunkNames, preconnect }: PreloadDataOptions): Plugin {
  let base = '/';

  return {
    name: 'motomatch-preload-data',
    apply: 'build',
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, context) {
        const tags: HtmlTagDescriptor[] = [];
        if (preconnect) {
          tags.push({
            tag: 'link',
            attrs: { rel: 'preconnect', href: new URL(preconnect).origin, crossorigin: true },
            injectTo: 'head',
          });
        }
        for (const chunk of Object.values(context.bundle ?? {})) {
          if (chunk.type === 'chunk' && chunk.isDynamicEntry && chunkNames.includes(chunk.name)) {
            tags.push({
              tag: 'link',
              attrs: { rel: 'modulepreload', crossorigin: true, href: base + chunk.fileName },
              injectTo: 'head',
            });
          }
        }
        return tags;
      },
    },
  };
}
