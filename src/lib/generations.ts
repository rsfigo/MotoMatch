/**
 * Hilfsfunktionen rund um Generationen (alle Baujahre, in denen ein Modell technisch gleich ist).
 * Generationen sind in den Daten chronologisch sortiert: die älteste zuerst.
 */
import type { Generation, Model } from '@/data/schema';
import { formatYearRange } from './format';

/** Neueste Generation eines Modells (die letzte in der Liste). */
export function latestGeneration(model: Model): Generation {
  const latest = model.generations.at(-1);
  if (!latest) throw new Error(`Modell ${model.id} hat keine Generation`);
  return latest;
}

/** Sucht eine Generation per ID. Unbekannte oder fehlende ID → neueste Generation. */
export function findGeneration(model: Model, generationId?: string | null): Generation {
  return (
    model.generations.find((generation) => generation.id === generationId) ??
    latestGeneration(model)
  );
}

/** Alle Generationen ausser der neuesten, neueste zuerst. */
export function olderGenerations(model: Model): Generation[] {
  return model.generations.slice(0, -1).reverse();
}

/** Baujahre als Text: «2022–2024» oder «ab 2025». */
export function generationYears(generation: Generation): string {
  return formatYearRange(generation.yearFrom, generation.yearTo);
}

/** Wird die Generation noch gebaut? */
export function isCurrentGeneration(generation: Generation): boolean {
  return generation.yearTo === null;
}
