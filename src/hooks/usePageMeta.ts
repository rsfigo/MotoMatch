import { useEffect } from 'react';
import { t } from '@/i18n';

interface PageMeta {
  /** Seitentitel ohne «MotoMatch»-Zusatz. Leer = Startseite. */
  title?: string;
  description?: string;
}

function setMetaContent(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute('content', content);
}

/**
 * Setzt Titel, Beschreibung und Open-Graph-Angaben der aktuellen Seite.
 * Die Grundwerte stehen in index.html (für Crawler ohne JavaScript).
 */
export function usePageMeta({ title, description }: PageMeta): void {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${t.site.name}` : `${t.site.name} – ${t.site.claim}`;
    const fullDescription = description ?? t.site.description;

    document.title = fullTitle;
    setMetaContent('meta[name="description"]', fullDescription);
    setMetaContent('meta[property="og:title"]', fullTitle);
    setMetaContent('meta[property="og:description"]', fullDescription);
  }, [title, description]);
}
