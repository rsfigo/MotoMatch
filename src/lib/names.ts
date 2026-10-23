/**
 * Namen der Modelle
 * -----------------
 * Wird auch beim Build genutzt (Prerendering in scripts/seoPlugin.ts) und läuft dort direkt
 * in Node – deshalb relative Importe mit .ts-Endung.
 */
import type { Manufacturer, Model } from '../data/schema.ts';

/** Voller Name, z. B. «Yamaha MT-07». */
export function modelFullName(model: Model, manufacturers: readonly Manufacturer[]): string {
  const manufacturer = manufacturers.find((item) => item.id === model.manufacturerId);
  return manufacturer ? `${manufacturer.name} ${model.name}` : model.name;
}

/** Modelle alphabetisch nach vollem Namen. */
export function sortByFullName(
  models: readonly Model[],
  manufacturers: readonly Manufacturer[],
): Model[] {
  return [...models].sort((a, b) =>
    modelFullName(a, manufacturers).localeCompare(modelFullName(b, manufacturers), 'de-CH'),
  );
}
