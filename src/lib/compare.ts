/**
 * Vergleichs-Logik – reine Funktionen, gut testbar.
 *
 * In der URL steht pro Bike entweder die Modell-ID (= neueste Generation) oder die
 * Generations-ID: /compare?bikes=yamaha-mt-07-2021,kawasaki-z650
 */
import type { Extra, Feature, Generation, Model } from '@/data/schema';
import { MAX_COMPARE } from './compareSelection';
import { extraAvailability, unionExtras } from './extras';
import { latestGeneration } from './generations';
import type { BetterWhen, SpecDefinition } from './specs';

export interface CompareItem {
  model: Model;
  generation: Generation;
}

/** Liest «a,b-2021,c» und findet Modelle bzw. Generationen. Unbekanntes wird ignoriert. */
export function resolveCompareItems(
  value: string | null,
  models: readonly Model[],
  max = MAX_COMPARE,
): CompareItem[] {
  const items: CompareItem[] = [];
  const tokens = (value ?? '')
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);

  for (const token of tokens) {
    if (items.length >= max) break;
    const model =
      models.find((candidate) => candidate.id === token) ??
      models.find((candidate) =>
        candidate.generations.some((generation) => generation.id === token),
      );
    if (!model || items.some((item) => item.model.id === model.id)) continue;
    const generation =
      model.generations.find((candidate) => candidate.id === token) ?? latestGeneration(model);
    items.push({ model, generation });
  }
  return items;
}

/** Schreibt die Auswahl zurück in die URL-Form (neueste Generation = nur Modell-ID). */
export function serializeCompareItems(items: readonly CompareItem[]): string {
  return items
    .map(({ model, generation }) =>
      generation.id === latestGeneration(model).id ? model.id : generation.id,
    )
    .join(',');
}

/**
 * Welche Spalten haben den besten Wert? Bei Gleichstand alle besten.
 * Leer, wenn es kein «besser» gibt, weniger als zwei Werte vorliegen oder alle gleich sind.
 */
export function bestIndices(
  values: readonly (number | undefined)[],
  betterWhen: BetterWhen,
): Set<number> {
  const present = values.filter((value): value is number => value !== undefined);
  if (betterWhen === 'none' || present.length < 2) return new Set();
  const best = betterWhen === 'higher' ? Math.max(...present) : Math.min(...present);
  if (present.every((value) => value === best)) return new Set();
  return new Set(values.flatMap((value, index) => (value === best ? [index] : [])));
}

/** Unterscheiden sich die angezeigten Werte? Fehlende Werte zählen als eigener Wert. */
export function hasDifference(displays: readonly (string | null)[]): boolean {
  return new Set(displays).size > 1;
}

/**
 * Was gerundet gleich aussieht wie der Bestwert (z. B. zweimal «ca. 340 km»), gilt
 * ebenfalls als Bestwert. Sehen danach alle gleich aus, gibt es keinen Bestwert.
 */
function withDisplayTies(
  best: ReadonlySet<number>,
  values: readonly (number | undefined)[],
  displays: readonly (string | null)[],
): Set<number> {
  const bestDisplays = new Set([...best].map((index) => displays[index]));
  const tied = values.flatMap((value, index) =>
    value !== undefined && bestDisplays.has(displays[index]) ? [index] : [],
  );
  const presentCount = values.filter((value) => value !== undefined).length;
  return tied.length === presentCount ? new Set() : new Set(tied);
}

export interface CompareRow {
  spec: SpecDefinition;
  values: (number | undefined)[];
  displays: (string | null)[];
  /** Spalten mit dem besten Wert */
  best: Set<number>;
  /** Bester Wert der Zeile (für Differenzen und Balken) */
  bestValue: number | undefined;
  different: boolean;
}

/**
 * Baut die Zeilen eines Abschnitts. Kernfelder erscheinen immer, optionale nur, wenn
 * mindestens ein Bike einen Wert hat. Mit `onlyDifferences` fallen gleiche Zeilen weg.
 */
export function buildCompareRows(
  specs: readonly SpecDefinition[],
  generations: readonly Generation[],
  { onlyDifferences = false }: { onlyDifferences?: boolean } = {},
): CompareRow[] {
  return specs.flatMap((spec) => {
    const values = generations.map((generation) => spec.value(generation));
    const displays = generations.map((generation) => spec.display(generation));
    const anyValue = displays.some((display) => display !== null);
    if (!spec.core && !anyValue) return [];

    const different = hasDifference(displays);
    if (onlyDifferences && !different) return [];

    const strictBest = bestIndices(values, spec.betterWhen);
    const firstBest = [...strictBest][0];
    return [
      {
        spec,
        values,
        displays,
        best: withDisplayTies(strictBest, values, displays),
        bestValue: firstBest === undefined ? undefined : values[firstBest],
        different,
      },
    ];
  });
}

/**
 * Differenz-Chip zum Bestwert der Zeile, z. B. «−46 PS» oder «+20 kg».
 * Leer beim Bestwert selbst, ohne Bestwert oder wenn gerundet kein Unterschied bleibt.
 */
export function deltaToBest(row: CompareRow, index: number): string | undefined {
  const value = row.values[index];
  const { spec, bestValue } = row;
  if (!spec.formatDelta || value === undefined || bestValue === undefined) return undefined;
  if (row.best.size === 0 || row.best.has(index)) return undefined;
  const text = spec.formatDelta(value, bestValue);
  // «±0 PS»: gerundet gleich – dann lieber kein Chip
  return text.startsWith('±') ? undefined : text;
}

/**
 * Länge des Balkens von 0 bis 1: Wert geteilt durch die feste Obergrenze (z. B. 10 bei
 * Wertungen) oder durch den grössten Wert der Zeile. Nur für Messgrössen (mit formatValue)
 * und nur, wenn es etwas zu vergleichen gibt.
 */
export function barFraction(row: CompareRow, index: number): number | undefined {
  const value = row.values[index];
  if (!row.spec.formatValue || value === undefined) return undefined;
  const present = row.values.filter((candidate): candidate is number => candidate !== undefined);
  // Ein einzelner Wert lässt sich mit nichts vergleichen – ausser mit einer festen Skala
  if (present.length < 2 && row.spec.scaleMax === undefined) return undefined;
  const max = row.spec.scaleMax ?? Math.max(...present);
  return max > 0 ? Math.min(value / max, 1) : undefined;
}

export interface ExtraRow {
  feature: Feature;
  /** Pro Bike: Serie, optional oder null (hat es nicht) */
  availability: (Extra['availability'] | null)[];
  different: boolean;
}

/**
 * Zeilen des Abschnitts «Extras»: jedes Extra, das mindestens eines der Bikes hat.
 * Hat keines Extras, ist die Liste leer und der Abschnitt entfällt.
 */
export function buildExtraRows(
  generations: readonly Generation[],
  features: readonly Feature[],
  { onlyDifferences = false }: { onlyDifferences?: boolean } = {},
): ExtraRow[] {
  return unionExtras(
    generations.map((generation) => generation.extras),
    features,
  ).flatMap((feature) => {
    const availability = generations.map((generation) =>
      extraAvailability(generation.extras, feature.key),
    );
    const different = new Set(availability).size > 1;
    return onlyDifferences && !different ? [] : [{ feature, availability, different }];
  });
}
