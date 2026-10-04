/**
 * Auswahl für den Vergleich (2–3 Bikes) – reine Funktionen.
 * Gespeichert wird sie in compareStore.ts, angezeigt in der Vergleichsleiste.
 */

export const MAX_COMPARE = 3;
export const MIN_COMPARE = 2;

/** Fügt ein Bike hinzu oder entfernt es. Ist die Auswahl voll, bleibt sie unverändert. */
export function toggleInSelection(ids: readonly string[], id: string, max = MAX_COMPARE): string[] {
  if (ids.includes(id)) return ids.filter((existing) => existing !== id);
  if (ids.length >= max) return [...ids];
  return [...ids, id];
}

/** Liest "?bikes=a,b,c": ohne Duplikate, höchstens `max` Einträge. */
export function parseCompareParam(value: string | null, max = MAX_COMPARE): string[] {
  if (!value) return [];
  const ids = value
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  return [...new Set(ids)].slice(0, max);
}

/** Link zur Vergleichsseite, z. B. /compare?bikes=yamaha-mt-07,kawasaki-z650 */
export function compareUrl(ids: readonly string[]): string {
  return ids.length > 0 ? `/compare?bikes=${ids.join(',')}` : '/compare';
}
