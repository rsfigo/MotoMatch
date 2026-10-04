/**
 * Extras (Griffheizung, Tempomat, …) gruppiert anzeigen und für den Vergleich vereinen.
 */
import { FEATURE_GROUPS, type Extra, type Feature, type FeatureGroup } from '@/data/schema';

export interface ExtraItem {
  feature: Feature;
  availability: Extra['availability'];
  detail?: string;
}

export interface ExtraGroup {
  group: FeatureGroup;
  items: ExtraItem[];
}

/**
 * Extras einer Generation nach Gruppen (Komfort, Sicherheit, …).
 * Reihenfolge wie in features.json; leere Gruppen fallen weg.
 */
export function groupExtras(
  extras: readonly Extra[] | undefined,
  features: readonly Feature[],
): ExtraGroup[] {
  const byKey = new Map((extras ?? []).map((extra) => [extra.key, extra]));

  return FEATURE_GROUPS.map((group) => ({
    group,
    items: features.flatMap((feature) => {
      const extra = feature.group === group ? byKey.get(feature.key) : undefined;
      return extra ? [{ feature, availability: extra.availability, detail: extra.detail }] : [];
    }),
  })).filter((group) => group.items.length > 0);
}

/**
 * Für den Vergleich: alle Extras, die mindestens eines der Bikes hat –
 * in der Reihenfolge von features.json. Hat keines Extras, ist die Liste leer.
 */
export function unionExtras(
  extrasPerBike: readonly (readonly Extra[] | undefined)[],
  features: readonly Feature[],
): Feature[] {
  const keys = new Set(extrasPerBike.flatMap((extras) => (extras ?? []).map((extra) => extra.key)));
  return features.filter((feature) => keys.has(feature.key));
}

/** Verfügbarkeit eines Extras bei einem Bike – oder null, wenn es fehlt. */
export function extraAvailability(
  extras: readonly Extra[] | undefined,
  key: string,
): Extra['availability'] | null {
  return extras?.find((extra) => extra.key === key)?.availability ?? null;
}
