/**
 * HTTP-Header für Cloudflare (Datei dist/_headers)
 * -----------------------------------------------
 * Cloudflare liest _headers beim Veröffentlichen und setzt die Header bei jeder Antwort;
 * die Datei selbst wird nicht ausgeliefert. Grenzen laut Doku: 100 Regeln, 2’000 Zeichen
 * pro Zeile (https://developers.cloudflare.com/workers/static-assets/headers/).
 */
import { createHash } from 'node:crypto';

/**
 * Hashes aller Inline-Skripte (ohne src) für script-src. Heute ist das nur das Skript in
 * index.html, das vor dem ersten Rendern das Theme setzt.
 */
export function inlineScriptHashes(html: string): string[] {
  return [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(
    ([, script = '']) => `'sha256-${createHash('sha256').update(script, 'utf8').digest('base64')}'`,
  );
}

export function contentSecurityPolicy({
  scriptHashes,
  connectOrigins,
}: {
  scriptHashes: readonly string[];
  /** Weitere Adressen für fetch, z. B. die Supabase-API (nur im Supabase-Modus). */
  connectOrigins: readonly string[];
}): string {
  return [
    "default-src 'self'",
    ['script-src', "'self'", ...scriptHashes].join(' '),
    // Motion fügt für Layout-Animationen (popLayout) kurz <style>-Elemente ein
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    ['connect-src', "'self'", ...connectOrigins].join(' '),
    // Video-Reviews, erst nach dem Klick auf «Abspielen»
    'frame-src https://www.youtube-nocookie.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

/** Inhalt von dist/_headers. */
export function headersFile(csp: string): string {
  return [
    '/*',
    `  Content-Security-Policy: ${csp}`,
    '  X-Frame-Options: DENY',
    '  X-Content-Type-Options: nosniff',
    // Schickt beim Wechsel auf andere Websites nur die Domain mit. YouTube verlangt für
    // eingebettete Videos einen Referrer – «no-referrer» würde die Reviews brechen.
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    // Dateien mit Hash im Namen ändern sich nie; ohne diese Regel schickt Cloudflare
    // «max-age=0, must-revalidate» (so bleibt HTML immer aktuell).
    '/assets/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
  ].join('\n');
}
