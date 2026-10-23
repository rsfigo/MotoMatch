import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { applyPageMeta, escapeHtml } from './pageHtml.ts';

/** Die echte index.html – so fällt auf, wenn eine Änderung dort das Prerendering bricht. */
const INDEX_HTML = readFileSync(
  fileURLToPath(new URL('../../index.html', import.meta.url)),
  'utf8',
);

describe('Kopfdaten in index.html einsetzen', () => {
  it('ersetzt Titel, Beschreibung und Open Graph, der Rest bleibt gleich', () => {
    const html = applyPageMeta(INDEX_HTML, {
      title: 'Alle Bikes · MotoMatch',
      description: 'Alle Motorräder im Überblick.',
    });

    expect(html).toContain('<title>Alle Bikes · MotoMatch</title>');
    expect(html).toContain('<meta name="description" content="Alle Motorräder im Überblick." />');
    expect(html).toContain('<meta property="og:title" content="Alle Bikes · MotoMatch" />');
    expect(html).toContain(
      '<meta property="og:description" content="Alle Motorräder im Überblick." />',
    );
    expect(html).not.toContain('Ausstattung auf einen Blick.');
    expect(html).toContain("localStorage.getItem('motomatch-theme')");
    expect(html).toContain('<meta name="theme-color" content="#0B0C0F" />');
  });

  it('setzt mit Domain die kanonische URL und og:url der Seite', () => {
    const template = INDEX_HTML.replace(
      '</head>',
      '<link rel="canonical" href="https://example.ch/">\n' +
        '<meta property="og:url" content="https://example.ch/">\n</head>',
    );
    const html = applyPageMeta(template, {
      title: 'Titel',
      description: 'Beschreibung',
      url: 'https://example.ch/bikes/testbike',
    });

    expect(html).toContain('<link rel="canonical" href="https://example.ch/bikes/testbike" />');
    expect(html).toContain(
      '<meta property="og:url" content="https://example.ch/bikes/testbike" />',
    );
    expect(html).not.toContain('href="https://example.ch/"');
  });

  it('maskiert Sonderzeichen und lässt «$» unverändert', () => {
    expect(escapeHtml('A & B <"C">')).toBe('A &amp; B &lt;&quot;C&quot;&gt;');

    const html = applyPageMeta(INDEX_HTML, {
      title: 'Tom & Jerry',
      description: 'Preis «CHF 9’990.–», nicht $1',
    });
    expect(html).toContain('<title>Tom &amp; Jerry</title>');
    expect(html).toContain('content="Preis «CHF 9’990.–», nicht $1"');
  });

  it('bricht ab, wenn ein Tag fehlt oder doppelt vorkommt', () => {
    const meta = { title: 'Titel', description: 'Beschreibung' };
    expect(() => applyPageMeta('<html><head></head></html>', meta)).toThrow(/<title>/);
    expect(() =>
      applyPageMeta(INDEX_HTML.replace('</head>', '<title>Zweiter Titel</title></head>'), meta),
    ).toThrow(/2-mal/);
    expect(() => applyPageMeta(INDEX_HTML, { ...meta, url: 'https://example.ch/x' })).toThrow(
      /canonical/,
    );
  });
});
