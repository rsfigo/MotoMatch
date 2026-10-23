import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { pageDescription, pageTitle, type PageMeta } from '@/lib/pageMeta';

/** Öffentliche Adresse der Website (nur gesetzt, wenn die Domain feststeht). */
const SITE_URL = import.meta.env.VITE_SITE_URL?.trim().replace(/\/+$/, '') || undefined;

function setMetaContent(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute('content', content);
}

/**
 * «noindex» für Seiten, die nicht in den Suchindex gehören. Unbekannte Pfade liefert der
 * Server als Single-Page-App mit Status 200 aus; so behandelt Google sie trotzdem als
 * «nicht gefunden» (siehe DECISIONS.md, M8).
 */
function setNoindex(noindex: boolean) {
  const existing = document.head.querySelector('meta[name="robots"]');
  if (!noindex) {
    existing?.remove();
    return;
  }
  if (existing) return;
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex';
  document.head.append(meta);
}

/**
 * Setzt Titel, Beschreibung und Open-Graph-Angaben der aktuellen Seite.
 * Die Grundwerte stehen in index.html; der Build schreibt sie pro Seite vorab in eine eigene
 * HTML-Datei (Crawler ohne JavaScript, siehe scripts/seoPlugin.ts). Ist VITE_SITE_URL
 * gesetzt, zeigen die kanonische URL und og:url auf den Pfad ohne Parameter – Filter,
 * Vergleiche und Wizard-Antworten in der URL gelten nicht als eigene Seiten.
 */
export function usePageMeta({ title, description, noindex = false }: PageMeta): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = pageTitle({ title });
    const fullDescription = pageDescription({ description });

    document.title = fullTitle;
    setMetaContent('meta[name="description"]', fullDescription);
    setMetaContent('meta[property="og:title"]', fullTitle);
    setMetaContent('meta[property="og:description"]', fullDescription);
    setNoindex(noindex);

    if (SITE_URL) {
      const url = `${SITE_URL}${pathname}`;
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
      setMetaContent('meta[property="og:url"]', url);
    }
  }, [title, description, noindex, pathname]);
}
