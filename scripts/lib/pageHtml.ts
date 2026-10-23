/**
 * Kopfdaten in die fertige index.html einsetzen
 * ---------------------------------------------
 * Für das Prerendering (scripts/seoPlugin.ts): Aus der gebauten index.html entsteht pro Seite
 * eine Kopie mit eigenem Titel, eigener Beschreibung und – sobald die Domain feststeht –
 * eigener kanonischer URL. Alles andere (Skripte, Styles, Theme) bleibt gleich.
 */

export interface HeadMeta {
  title: string;
  description: string;
  /** Absolute Adresse der Seite; nur mit VITE_SITE_URL (dann gibt es canonical und og:url). */
  url?: string;
}

/** Maskiert Text für HTML-Inhalt und Attribute in doppelten Anführungszeichen. */
export function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/** Ein Tag mit einem bestimmten Attribut – egal, in welcher Reihenfolge und auf wie vielen Zeilen. */
function tagWith(name: 'meta' | 'link', attribute: string): RegExp {
  return new RegExp(`<${name}\\s[^>]*\\b${attribute}[^>]*>`);
}

/**
 * Ersetzt genau ein Vorkommen. Fehlt das Tag oder kommt es mehrfach vor, bricht der Build ab –
 * sonst entstünden nach einer Änderung an index.html still falsche Seiten.
 */
function replaceTag(html: string, pattern: RegExp, tag: string, what: string): string {
  const count = html.match(new RegExp(pattern.source, 'g'))?.length ?? 0;
  if (count !== 1) {
    throw new Error(`index.html: ${what} kommt ${count}-mal vor, erwartet ist genau einmal.`);
  }
  // Als Funktion übergeben, damit «$» im Text nicht als Ersetzungsmuster gilt
  return html.replace(pattern, () => tag);
}

export function applyPageMeta(html: string, meta: HeadMeta): string {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);

  let result = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`, '<title>');
  result = replaceTag(
    result,
    tagWith('meta', 'name="description"'),
    `<meta name="description" content="${description}" />`,
    'meta description',
  );
  result = replaceTag(
    result,
    tagWith('meta', 'property="og:title"'),
    `<meta property="og:title" content="${title}" />`,
    'og:title',
  );
  result = replaceTag(
    result,
    tagWith('meta', 'property="og:description"'),
    `<meta property="og:description" content="${description}" />`,
    'og:description',
  );

  if (meta.url) {
    const url = escapeHtml(meta.url);
    result = replaceTag(
      result,
      tagWith('link', 'rel="canonical"'),
      `<link rel="canonical" href="${url}" />`,
      'canonical',
    );
    result = replaceTag(
      result,
      tagWith('meta', 'property="og:url"'),
      `<meta property="og:url" content="${url}" />`,
      'og:url',
    );
  }
  return result;
}
