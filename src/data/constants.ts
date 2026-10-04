/**
 * Konstanten und Hilfsfunktionen zum Datenmodell – ohne Zod
 * ----------------------------------------------------------
 * Die App darf diese Werte zur Laufzeit importieren. Aus schema.ts dagegen nur Typen
 * (`import type`), sonst landet Zod im Browser-Bundle (rund 27 kB gzip).
 *
 * Wird auch von Node-Skripten geladen (über schema.ts) – deshalb kein `@/`-Alias.
 */

export const CATEGORIES = [
  'naked',
  'supersport',
  'sport',
  'touring',
  'adventure',
  'enduro',
  'supermoto',
  'cruiser',
  'retro',
  'scooter',
] as const;

export const FEATURE_GROUPS = [
  'comfort',
  'safety',
  'chassis',
  'electronics',
  'technology',
] as const;

/** Icons aus lucide-react, die für Extras verwendet werden dürfen (siehe FeatureIcon.tsx). */
export const FEATURE_ICONS = [
  'flame',
  'armchair',
  'gauge',
  'wind',
  'key-round',
  'square-parking',
  'usb',
  'shield-check',
  'activity',
  'lightbulb',
  'circle-gauge',
  'sliders-horizontal',
  'cpu',
  'tablet',
  'smartphone',
  'layers',
  'cog',
  'bot',
] as const;

/**
 * Liest die Video-ID aus einem YouTube-Link.
 * Unterstützt https://www.youtube.com/watch?v=ID und https://youtu.be/ID.
 */
export function getYouTubeVideoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const isValidId = (id: string | null): id is string => !!id && /^[A-Za-z0-9_-]{11}$/.test(id);

  if (parsed.hostname === 'youtu.be') {
    const id = parsed.pathname.slice(1);
    return isValidId(id) ? id : null;
  }
  if (['www.youtube.com', 'youtube.com', 'm.youtube.com'].includes(parsed.hostname)) {
    const id = parsed.searchParams.get('v');
    return isValidId(id) ? id : null;
  }
  return null;
}
