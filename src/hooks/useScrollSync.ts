import { useEffect, useState } from 'react';

export interface ScrollEdges {
  /** ganz links */
  atStart: boolean;
  /** ganz rechts (oder gar nicht scrollbar) */
  atEnd: boolean;
}

/**
 * Überträgt die waagrechte Scrollposition von `source` auf `target` – z. B. von der
 * Vergleichstabelle auf ihren Sticky-Kopf – und meldet, ob noch mehr Inhalt links oder
 * rechts liegt. Die Elemente kommen als State (Callback-Ref), damit der Effekt neu läuft,
 * sobald sie erscheinen.
 */
export function useScrollSync(source: HTMLElement | null, target: HTMLElement | null): ScrollEdges {
  const [edges, setEdges] = useState<ScrollEdges>({ atStart: true, atEnd: true });

  useEffect(() => {
    if (!source) return;
    const element = source;

    function update() {
      target?.scrollTo({ left: element.scrollLeft, behavior: 'instant' });
      const maxScroll = element.scrollWidth - element.clientWidth;
      const atStart = element.scrollLeft <= 1;
      const atEnd = element.scrollLeft >= maxScroll - 1;
      setEdges((previous) =>
        previous.atStart === atStart && previous.atEnd === atEnd ? previous : { atStart, atEnd },
      );
    }

    update();
    element.addEventListener('scroll', update, { passive: true });
    // Auch bei Grössenänderungen prüfen (Fenster, Bike hinzugefügt oder entfernt)
    const observer = new ResizeObserver(update);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);

    return () => {
      element.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [source, target]);

  return edges;
}
