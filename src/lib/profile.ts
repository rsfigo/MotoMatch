/** Achsen des Einsatzprofils (Radar) – für Detailseite und Vergleich. */
import type { ProfileKey, Scores } from '@/data/schema';
import { t } from '@/i18n';

export const PROFILE_KEYS: readonly ProfileKey[] = [
  'beginner',
  'city',
  'touring',
  'sport',
  'offroad',
];

export const PROFILE_AXES = PROFILE_KEYS.map((key) => ({ key, label: t.profile[key] }));

/** Werte in der Reihenfolge der Achsen. */
export function profileValues(scores: Scores): number[] {
  return PROFILE_KEYS.map((key) => scores.profile[key]);
}
