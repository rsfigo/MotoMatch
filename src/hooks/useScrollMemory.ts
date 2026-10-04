import { useLayoutEffect, useRef } from 'react';
import { NavigationType, useLocation, useNavigationType } from 'react-router';

/** Gemerkte Scrollpositionen pro Verlaufseintrag (location.key). */
const scrollPositions = new Map<string, number>();

/**
 * Merkt sich beim Verlassen einer Seite die Scrollposition. Liefert die Position,
 * an die die neue Seite springen soll: bei «Zurück»/«Vorwärts» die gemerkte, sonst 0.
 */
export function useScrollMemory(): number {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousKey = useRef(location.key);

  useLayoutEffect(() => {
    // Läuft direkt nach dem Standortwechsel: scrollY gehört noch zur alten Seite.
    if (previousKey.current !== location.key) {
      scrollPositions.set(previousKey.current, window.scrollY);
      previousKey.current = location.key;
    }
  }, [location.key]);

  return navigationType === NavigationType.Pop ? (scrollPositions.get(location.key) ?? 0) : 0;
}
