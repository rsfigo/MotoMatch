/**
 * Kopfdaten der Seiten
 * --------------------
 * Titel und Beschreibung jeder Seite an einem Ort für App und Build: Im Browser setzt sie
 * usePageMeta, beim Build schreibt scripts/seoPlugin.ts sie vorab in eine eigene HTML-Datei
 * pro Seite – für Suchmaschinen und Vorschauen beim Teilen, die kein JavaScript ausführen.
 * Läuft deshalb auch in Node: relative Importe mit .ts-Endung.
 */
import type { Generation, Model } from '../data/schema.ts';
import { t } from '../i18n/index.ts';
import { formatChf, formatPs, formatTorque } from './format.ts';
import { generationYears } from './generations.ts';

export interface PageMeta {
  /** Seitentitel ohne «MotoMatch»-Zusatz. Leer = Startseite. */
  title?: string;
  description?: string;
  /** Die Seite gehört nicht in den Suchindex (z. B. «Seite nicht gefunden»). */
  noindex?: boolean;
}

/** Titel im Browser-Tab, z. B. «Alle Bikes · MotoMatch»; ohne Titel der der Startseite. */
export function pageTitle(meta: PageMeta): string {
  return meta.title ? `${meta.title} · ${t.site.name}` : `${t.site.name} – ${t.site.claim}`;
}

/** Beschreibung für Suchmaschinen und Vorschauen; ohne eigene die der Website. */
export function pageDescription(meta: PageMeta): string {
  return meta.description ?? t.site.description;
}

/**
 * Seiten ohne Daten mit ihren Kopfdaten (für Prerendering und Sitemap). Die Detailseiten
 * der Bikes kommen beim Build aus den Daten dazu (bikePageMeta).
 */
export const STATIC_PAGES: readonly { path: string; meta: PageMeta }[] = [
  { path: '/', meta: {} },
  { path: '/bikes', meta: t.pages.catalog },
  { path: '/compare', meta: t.pages.compare },
  { path: '/match', meta: t.pages.match },
  { path: '/impressum', meta: t.pages.imprint },
  { path: '/datenschutz', meta: t.pages.privacy },
];

/** Detailseite: «Yamaha MT-07 (ab 2025)», dazu Tagline, Leistung, Drehmoment und Preis. */
export function bikePageMeta(fullName: string, model: Model, generation: Generation): PageMeta {
  const keyFigures = [
    formatPs(generation.engine.powerKw),
    formatTorque(generation.engine.torqueNm),
    formatChf(generation.price.chf),
  ].join(', ');
  return {
    title: `${fullName} (${generationYears(generation)})`,
    description: [model.tagline, `${keyFigures}.`].filter(Boolean).join(' '),
  };
}
