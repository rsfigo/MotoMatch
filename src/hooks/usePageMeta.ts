import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { t } from '@/i18n';

interface PageMeta {
  /** Seitentitel ohne «MotoMatch»-Zusatz. Leer = Startseite. */
  title?: string;
  description?: string;
}

/** Öffentliche Adresse der Website (nur gesetzt, wenn die Domain feststeht). */
const SITE_URL = import.meta.env.VITE_SITE_URL?.trim().replace(/\/+$/, '') || undefined;

function setMetaContent(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute('content', content);
}

/**
 * Setzt Titel, Beschreibung und Open-Graph-Angaben der aktuellen Seite.
 * Die Grundwerte stehen in index.html (für Crawler ohne JavaScript). Ist VITE_SITE_URL
 * gesetzt, zeigen die kanonische URL und og:url auf den Pfad ohne Parameter – Filter,
 * Vergleiche und Wizard-Antworten in der URL gelten nicht als eigene Seiten.
 */
export function usePageMeta({ title, description }: PageMeta): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} · ${t.site.name}` : `${t.site.name} – ${t.site.claim}`;
    const fullDescription = description ?? t.site.description;

    document.title = fullTitle;
    setMetaContent('meta[name="description"]', fullDescription);
    setMetaContent('meta[property="og:title"]', fullTitle);
    setMetaContent('meta[property="og:description"]', fullDescription);

    if (SITE_URL) {
      const url = `${SITE_URL}${pathname}`;
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
      setMetaContent('meta[property="og:url"]', url);
    }
  }, [title, description, pathname]);
}
