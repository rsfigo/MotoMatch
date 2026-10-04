/**
 * Datenzugriff
 * ------------
 * Die einzige Stelle, die weiss, woher die Daten kommen. Komponenten holen Daten nur
 * über diese Funktionen (bzw. die Hooks in src/hooks/useBikeData.ts).
 *
 * Phase 1: Die Daten liegen als JSON-Dateien im Repo und werden beim Build mitgebündelt.
 * Geprüft werden sie vorher mit Zod (`npm run validate:data` und die Tests) – deshalb
 * reicht hier eine Typ-Zusicherung, und Zod muss nicht in den Browser.
 *
 * Später: Dieselben Funktionen holen die Daten von einer API (z. B. MySQL dahinter).
 * Dann werden sie asynchron; die Hooks in useBikeData.ts kapseln diesen Wechsel.
 */
import featuresJson from '@/data/features.json';
import manufacturersJson from '@/data/manufacturers.json';
import type { Feature, Manufacturer, Model } from '@/data/schema';

// Alle Dateien in src/data/models werden automatisch eingelesen.
const modelFiles = import.meta.glob<Model>('/src/data/models/*.json', {
  eager: true,
  import: 'default',
});

const manufacturers = manufacturersJson as Manufacturer[];
const features = featuresJson as Feature[];
const manufacturersById = new Map(
  manufacturers.map((manufacturer) => [manufacturer.id, manufacturer]),
);
const featuresByKey = new Map(features.map((feature) => [feature.key, feature]));

/** Voller Name, z. B. «Yamaha MT-07». */
export function getModelFullName(model: Model): string {
  const manufacturer = manufacturersById.get(model.manufacturerId);
  return manufacturer ? `${manufacturer.name} ${model.name}` : model.name;
}

const models: Model[] = Object.values(modelFiles).sort((a, b) =>
  getModelFullName(a).localeCompare(getModelFullName(b), 'de-CH'),
);
const modelsById = new Map(models.map((model) => [model.id, model]));

/** Alle Modelle, alphabetisch nach vollem Namen. */
export function getAllModels(): readonly Model[] {
  return models;
}

export function getModel(id: string): Model | undefined {
  return modelsById.get(id);
}

export function getManufacturers(): readonly Manufacturer[] {
  return manufacturers;
}

export function getManufacturer(id: string): Manufacturer | undefined {
  return manufacturersById.get(id);
}

/** Katalog aller möglichen Extras (Griffheizung, Tempomat, …). */
export function getFeatures(): readonly Feature[] {
  return features;
}

export function getFeature(key: string): Feature | undefined {
  return featuresByKey.get(key);
}
