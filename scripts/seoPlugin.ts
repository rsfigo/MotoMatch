/**
 * SEO beim Build
 * --------------
 * - Prerendering der Kopfdaten: Aus der fertigen index.html entsteht für jede Seite ohne
 *   Parameter und für jedes Bike eine eigene HTML-Datei mit Titel, Beschreibung und
 *   Open-Graph-Angaben (z. B. dist/bikes/yamaha-mt-07.html). Suchmaschinen und Vorschauen
 *   beim Teilen sehen so die richtigen Angaben, auch ohne JavaScript. Den Inhalt baut weiterhin
 *   React im Browser (Entscheid in DECISIONS.md, M8).
 * - robots.txt.
 * - Nur mit VITE_SITE_URL (öffentliche Adresse ohne «/» am Ende): kanonische URLs, og:url,
 *   Vorschaubild mit absoluter Adresse und sitemap.xml. Open Graph und Sitemaps verlangen
 *   absolute Adressen, und die Domain steht noch nicht fest.
 *
 * Die Bikes stammen aus den JSON-Dateien in src/data, geprüft wie mit validate:data. Titel und
 * Beschreibungen kommen aus src/lib/pageMeta.ts – dieselben, die die App im Browser setzt.
 */
import type { HtmlTagDescriptor, Plugin } from 'vite';
import { validateDataset, type ValidDataset } from '../src/data/validateDataset.ts';
import { latestGeneration } from '../src/lib/generations.ts';
import { modelFullName } from '../src/lib/names.ts';
import {
  bikePageMeta,
  pageDescription,
  pageTitle,
  STATIC_PAGES,
  type PageMeta,
} from '../src/lib/pageMeta.ts';
import { readRawDataset } from './lib/dataset.ts';
import { applyPageMeta } from './lib/pageHtml.ts';

/** Vorschaubild in public/ (1200 × 630 px). */
const OG_IMAGE = { path: '/og-image.png', width: 1200, height: 630 };

interface Page {
  path: string;
  meta: PageMeta;
}

function loadDataset(): ValidDataset {
  const { errors, data } = validateDataset(readRawDataset());
  if (!data || errors.length > 0) {
    throw new Error(
      `Ungültige Bike-Daten (Details: npm run validate:data):\n- ${errors.join('\n- ')}`,
    );
  }
  return data;
}

/** Alle Seiten ohne Parameter: die festen Seiten und pro Modell die Detailseite. */
function allPages(data: ValidDataset): Page[] {
  const bikePages = data.models
    .map((model) => ({
      path: `/bikes/${model.id}`,
      meta: bikePageMeta(modelFullName(model, data.manufacturers), model, latestGeneration(model)),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
  return [...STATIC_PAGES, ...bikePages];
}

/**
 * Datei, die der Server für einen Pfad ausliefert: «/bikes» → bikes.html,
 * «/bikes/yamaha-mt-07» → bikes/yamaha-mt-07.html (Adressen ohne «/» am Ende).
 */
function htmlFileFor(path: string): string {
  return path === '/' ? 'index.html' : `${path.slice(1)}.html`;
}

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
  imageAlt,
}: {
  siteUrl: string | undefined;
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

    generateBundle: {
      // Nach den übrigen Plugins: Erst dann liegt die fertige index.html im Bundle.
      order: 'post',
      handler(_options, bundle) {
        const template = bundle['index.html'];
        if (template?.type !== 'asset' || typeof template.source !== 'string') {
          this.error('index.html fehlt im Build – die Seiten lassen sich nicht vorbereiten.');
        }

        const pages = allPages(loadDataset());
        for (const page of pages) {
          if (page.path === '/') continue; // Die Startseite ist index.html selbst
          this.emitFile({
            type: 'asset',
            fileName: htmlFileFor(page.path),
            source: applyPageMeta(template.source, {
              title: pageTitle(page.meta),
              description: pageDescription(page.meta),
              url: base && `${base}${page.path}`,
            }),
          });
        }

        const robots = ['User-agent: *', 'Allow: /'];
        if (base) {
          this.emitFile({
            type: 'asset',
            fileName: 'sitemap.xml',
            source: sitemap(
              base,
              pages.map((page) => page.path),
            ),
          });
          robots.push('', `Sitemap: ${base}/sitemap.xml`);
        }
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` });
      },
    },
  };
}
