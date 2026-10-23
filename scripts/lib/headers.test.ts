import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { contentSecurityPolicy, headersFile, inlineScriptHashes } from './headers.ts';

const INDEX_HTML = readFileSync(
  fileURLToPath(new URL('../../index.html', import.meta.url)),
  'utf8',
);

describe('HTTP-Header für Cloudflare', () => {
  it('erlaubt genau das Inline-Skript aus index.html über seinen Hash', () => {
    const hashes = inlineScriptHashes(INDEX_HTML);
    expect(hashes).toHaveLength(1);

    const script = /<script>([\s\S]*?)<\/script>/.exec(INDEX_HTML)?.[1] ?? '';
    const expected = createHash('sha256').update(script, 'utf8').digest('base64');
    expect(hashes[0]).toBe(`'sha256-${expected}'`);
  });

  it('ignoriert Skripte mit src', () => {
    const html = '<script type="module" crossorigin src="/assets/index.js"></script>';
    expect(inlineScriptHashes(html)).toEqual([]);
  });

  it('Skripte nur vom eigenen Server, die Supabase-API nur im Supabase-Modus', () => {
    const json = contentSecurityPolicy({ scriptHashes: ["'sha256-abc'"], connectOrigins: [] });
    expect(json).toContain("script-src 'self' 'sha256-abc'");
    expect(json).toContain("connect-src 'self';");
    expect(json).toContain("frame-ancestors 'none'");
    expect(json).toContain('frame-src https://www.youtube-nocookie.com');
    expect(json).not.toMatch(/script-src[^;]*unsafe/);

    const supabase = contentSecurityPolicy({
      scriptHashes: [],
      connectOrigins: ['https://projekt.supabase.co'],
    });
    expect(supabase).toContain("connect-src 'self' https://projekt.supabase.co;");
  });

  it('schreibt Regeln für alle Seiten und lange Cache-Zeiten für /assets/*', () => {
    const csp = contentSecurityPolicy({
      scriptHashes: inlineScriptHashes(INDEX_HTML),
      connectOrigins: ['https://projekt.supabase.co'],
    });
    const lines = headersFile(csp).split('\n');

    expect(lines[0]).toBe('/*');
    expect(lines).toContain('/assets/*');
    expect(lines).toContain('  Cache-Control: public, max-age=31536000, immutable');
    expect(lines).toContain('  X-Content-Type-Options: nosniff');
    // Grenze von Cloudflare: höchstens 2’000 Zeichen pro Zeile
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(2000);
  });
});
