/**
 * SEO beim Build
 * --------------
 * Ist die Umgebungsvariable VITE_SITE_URL gesetzt (öffentliche Adresse ohne «/» am Ende),
 * ergänzt dieses Vite-Plugin beim Build:
 * - in index.html die kanonische URL, og:url und das Vorschaubild mit absoluter Adresse,
 * - eine sitemap.xml mit allen Seiten und Bikes,
 * - in robots.txt den Verweis auf die Sitemap.
 *
 * Ohne VITE_SITE_URL fallen diese Angaben weg: Open Graph und Sitemaps verlangen absolute
 * Adressen, und die Domain steht noch nicht fest. robots.txt entsteht immer.
 */
import { readdirSync } from 'node:fs';
import type { HtmlTagDescriptor, Plugin } from 'vite';

/** Seiten ohne Parameter (Bikes kommen aus src/data/models). */
const STATIC_PATHS = ['/', '/bikes', '/compare', '/match', '/impressum', '/datenschutz'];

/** Vorschaubild in public/ (1200 × 630 px). */
const OG_IMAGE = { path: '/og-image.png', width: 1200, height: 630 };

function sitemap(base: string, paths: readonly string[]): string {
  const urls = paths.map((path) => `  <url><loc>${base}${path}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function seoPlugin({
  siteUrl,
  modelsDir,
  imageAlt,
}: {
  siteUrl: string | undefined;
  modelsDir: string;
  imageAlt: string;
}): Plugin {
  const base = siteUrl?.trim().replace(/\/+$/, '') || undefined;

  return {
    name: 'motomatch-seo',

    transformIndexHtml(): HtmlTagDescriptor[] {
      if (!base) return [];
      const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({
        tag: 'meta',
        attrs,
        injectTo: 'head',
      });
      return [
        { tag: 'link', attrs: { rel: 'canonical', href: `${base}/` }, injectTo: 'head' },
        meta({ property: 'og:url', content: `${base}/` }),
        meta({ property: 'og:image', content: `${base}${OG_IMAGE.path}` }),
        meta({ property: 'og:image:width', content: String(OG_IMAGE.width) }),
        meta({ property: 'og:image:height', content: String(OG_IMAGE.height) }),
        meta({ property: 'og:image:alt', content: imageAlt }),
        meta({ name: 'twitter:image', content: `${base}${OG_IMAGE.path}` }),
      ];
    },

    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /'];
      if (base) {
        const bikePaths = readdirSync(modelsDir)
          .filter((file) => file.endsWith('.json'))
          .map((file) => `/bikes/${file.slice(0, -'.json'.length)}`)
          .sort();
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: sitemap(base, [...STATIC_PATHS, ...bikePaths]),
        });
        robots.push('', `Sitemap: ${base}/sitemap.xml`);
      }
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` });
    },
  };
}
