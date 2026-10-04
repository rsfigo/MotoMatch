/**
 * «Ähnliche Bikes» auf der Detailseite.
 * Ähnlich heisst: gleiche Kategorie, ähnliche Leistung, ähnlicher Preis und gleicher
 * Führerausweis. Verglichen wird die jeweils neueste Generation.
 */
import type { Model } from '@/data/schema';
import { latestGeneration } from './generations';
import { getLicenceInfo } from './licence';

/** Relativer Unterschied zweier Werte (0 = gleich, 1 = sehr verschieden). */
function relativeDifference(a: number, b: number): number {
  return Math.abs(a - b) / Math.max(a, b, 1);
}

function licenceOfModel(model: Model) {
  const { engine, chassis, throttle } = latestGeneration(model);
  return getLicenceInfo({
    displacementCc: engine.displacementCc,
    powerKw: engine.powerKw,
    weightKg: chassis.weightKg,
    throttle,
  }).required;
}

/** Je kleiner, desto ähnlicher. */
export function similarityDistance(a: Model, b: Model): number {
  const genA = latestGeneration(a);
  const genB = latestGeneration(b);
  return (
    (a.category === b.category ? 0 : 1) * 1.5 +
    relativeDifference(genA.engine.powerKw, genB.engine.powerKw) +
    relativeDifference(genA.price.chf, genB.price.chf) +
    (licenceOfModel(a) === licenceOfModel(b) ? 0 : 0.5)
  );
}

/** Die `count` ähnlichsten Modelle (ohne das Modell selbst). */
export function findSimilarModels(model: Model, allModels: readonly Model[], count = 3): Model[] {
  return allModels
    .filter((other) => other.id !== model.id)
    .map((other) => ({ other, distance: similarityDistance(model, other) }))
    .sort((x, y) => x.distance - y.distance || x.other.name.localeCompare(y.other.name, 'de-CH'))
    .slice(0, count)
    .map(({ other }) => other);
}
