/**
 * Speichert die Vergleichsauswahl (Modell-IDs) im Browser, damit sie beim Wechsel
 * zwischen Katalog und Detailseite erhalten bleibt. Kein Provider nötig: Komponenten
 * lesen den Zustand über useCompareSelection (useSyncExternalStore).
 */
import { toggleInSelection } from './compareSelection';

const STORAGE_KEY = 'motomatch-compare';

function load(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

let selection: string[] = load();
const listeners = new Set<() => void>();

/**
 * Startpositionen für die «Flug»-Animation: Wo war das Bild auf der Karte,
 * als das Bike gewählt wurde? Sie gelten nur kurz, danach fliegt nichts mehr.
 */
const FLY_ORIGIN_MAX_AGE_MS = 800;
const flyOrigins = new Map<string, { rect: DOMRect; time: number }>();

function update(next: string[]) {
  selection = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Speicher nicht verfügbar – Auswahl gilt dann nur bis zum Neuladen.
  }
  listeners.forEach((listener) => listener());
}

// Pfeilfunktionen, damit man sie direkt weitergeben kann (z. B. onClick={compareStore.clear}).
export const compareStore = {
  getSnapshot: (): readonly string[] => selection,

  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  toggle: (id: string, origin?: DOMRect): void => {
    const next = toggleInSelection(selection, id);
    if (origin && next.length > selection.length) {
      flyOrigins.set(id, { rect: origin, time: performance.now() });
    }
    update(next);
  },

  remove: (id: string): void => {
    update(selection.filter((existing) => existing !== id));
  },

  clear: (): void => {
    update([]);
  },

  /** Startposition für die Flug-Animation, falls das Bike gerade eben gewählt wurde. */
  getFlyOrigin: (id: string): DOMRect | undefined => {
    const origin = flyOrigins.get(id);
    if (!origin || performance.now() - origin.time > FLY_ORIGIN_MAX_AGE_MS) return undefined;
    return origin.rect;
  },
};
